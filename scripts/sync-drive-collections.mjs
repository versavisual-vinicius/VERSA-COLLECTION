import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Carrega variáveis do .env.local ou process.env
function loadEnv() {
  const env = { ...process.env };
  if (fs.existsSync('.env.local')) {
    const lines = fs.readFileSync('.env.local', 'utf-8').split('\n');
    for (const line of lines) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        let val = match[2].trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        val = val.replace(/\\n/g, '\n');
        env[match[1].trim()] = val;
      }
    }
  }
  return env;
}

const env = loadEnv();
const clientEmail = env.GOOGLE_CLIENT_EMAIL;
const privateKey = env.GOOGLE_PRIVATE_KEY;
const rootFolderId = env.GOOGLE_DRIVE_ROOT_FOLDER_ID || env.GOOGLE_DRIVE_FOLDER_ID;

if (!clientEmail || !privateKey || !rootFolderId) {
  console.error('Erro: Credenciais do Google Drive não configuradas no .env.local.');
  process.exit(1);
}

const auth = new google.auth.JWT({
  email: clientEmail,
  key: privateKey,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const drive = google.drive({ version: 'v3', auth });

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

// Ordenação natural de strings com números (MODEC-2 antes de MODEC-10)
function naturalSort(a, b) {
  return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
}

function isValidImageFile(file) {
  if (!file || !file.name) return false;
  // Ignora arquivos ocultos de resource fork do macOS Finder (._*)
  if (file.name.startsWith('._') || file.name.startsWith('.')) return false;
  // Ignora arquivos corrompidos/metadados menores que 8 KB
  if (file.size !== undefined && Number(file.size) <= 8192) return false;
  return true;
}

async function resolveFolder(item) {
  if (item.mimeType === 'application/vnd.google-apps.folder') {
    return { id: item.id, name: item.name };
  }
  const targetId = item.shortcutDetails?.targetId || item.shortcutDetails?.targetFileId;
  if (item.mimeType === 'application/vnd.google-apps.shortcut' && targetId) {
    try {
      const target = await drive.files.get({
        fileId: targetId,
        fields: 'id, name, mimeType',
        supportsAllDrives: true,
      });
      if (target.data.mimeType === 'application/vnd.google-apps.folder') {
        return { id: target.data.id, name: item.name };
      }
    } catch (err) {
      console.warn(`Aviso: Atalho ${item.name} não pôde ser resolvido:`, err.message);
    }
  }
  return null;
}

async function fetchDirectPhotosInFolder(folderId) {
  const photos = [];
  let pageToken = null;

  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields:
        'nextPageToken, files(id, name, size, mimeType, imageMediaMetadata, webViewLink, webContentLink, createdTime)',
      pageSize: 1000,
      pageToken,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });

    if (res.data.files) {
      for (const f of res.data.files) {
        if (isValidImageFile(f)) {
          photos.push(f);
        }
      }
    }
    pageToken = res.data.nextPageToken;
  } while (pageToken);

  return photos;
}

async function fetchAllPhotosInFolder(folderId) {
  const directPhotos = await fetchDirectPhotosInFolder(folderId);
  if (directPhotos.length > 0) return directPhotos;

  // Caso a pasta contenha apenas subpastas (ex: Prontas Odonto -> Odonto, Odonto2), busca 1 nível abaixo
  const subRes = await drive.files.list({
    q: `'${folderId}' in parents and (mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/vnd.google-apps.shortcut') and trashed = false`,
    fields: 'files(id, name, mimeType, shortcutDetails)',
    pageSize: 100,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  const aggregated = [];
  for (const sub of subRes.data.files || []) {
    const resolvedSub = await resolveFolder(sub);
    if (resolvedSub) {
      const subPhotos = await fetchDirectPhotosInFolder(resolvedSub.id);
      aggregated.push(...subPhotos);
    }
  }
  return aggregated;
}

function buildImageSources(fileId, originalWidth, originalHeight) {
  const widths = [640, 1024, 2048];
  const sources = [];

  for (const w of widths) {
    if (originalWidth && w > originalWidth * 1.25) continue;
    const h =
      originalWidth && originalHeight
        ? Math.round((w * originalHeight) / originalWidth)
        : Math.round(w * 0.66);
    sources.push({
      url: `https://lh3.googleusercontent.com/d/${fileId}=w${w}`,
      width: w,
      height: h,
      format: 'jpeg',
    });
  }

  // Fallback de alta resolução limitado a w2400 para evitar timeout/429 em arquivos de 20MB+
  sources.push({
    url: `https://lh3.googleusercontent.com/d/${fileId}=w2400`,
    width: Math.min(originalWidth || 2400, 2400),
    height:
      originalWidth && originalHeight
        ? Math.round((Math.min(originalWidth, 2400) * originalHeight) / originalWidth)
        : 1600,
    format: 'jpeg',
  });

  return sources;
}

async function sync() {
  console.log('🔄 Iniciando sincronização do Google Drive...');
  console.log(`📁 Pasta Raiz: ${rootFolderId}`);

  const rootItems = await drive.files.list({
    q: `'${rootFolderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType, shortcutDetails)',
    pageSize: 200,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  const collections = [];
  const outDir = path.join(process.cwd(), 'src/data/collections');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const item of rootItems.data.files || []) {
    const folder = await resolveFolder(item);
    if (!folder) continue;

    const slug = slugify(folder.name);
    console.log(`\n📸 Processando coleção: "${folder.name}" (slug: ${slug})...`);

    const rawPhotos = await fetchAllPhotosInFolder(folder.id);
    console.log(`   Total de fotos válidas encontradas: ${rawPhotos.length}`);
    if (rawPhotos.length === 0) continue;

    rawPhotos.sort(naturalSort);

    const landscapeCandidate =
      rawPhotos.find((p) => {
        const w = p.imageMediaMetadata?.width || 0;
        const h = p.imageMediaMetadata?.height || 0;
        return w > h;
      }) || rawPhotos[0];

    const coverWidth = landscapeCandidate.imageMediaMetadata?.width || 3840;
    const coverHeight = landscapeCandidate.imageMediaMetadata?.height || 2560;

    const collectionData = {
      collection: {
        id: `col-${slug}`,
        slug,
        title: folder.name.toUpperCase(),
        businessName: 'Versa Visual',
        businessUrl: 'https://instagram.com/v1ncsc',
        cover: {
          alt: `Capa da coleção ${folder.name}`,
          width: coverWidth,
          height: coverHeight,
          dominantColor: '#12151a',
          sources: buildImageSources(landscapeCandidate.id, coverWidth, coverHeight),
        },
        coverFocalPoint: { x: 50, y: 35 },
        visibility: 'public',
        passwordRequired: false,
        favoritesEnabled: true,
        downloads: {
          enabled: true,
          individualEnabled: true,
          collectionEnabled: true,
          requiresEmail: false,
          requiresPin: false,
          allowedSizes: ['original', '3600', '2048', '1024', '640'],
        },
        sharingEnabled: true,
        slideshowEnabled: true,
        totalItems: rawPhotos.length,
        locale: 'pt-BR',
        theme: {
          headingFont: 'Outfit, sans-serif',
          bodyFont: 'DM Sans, sans-serif',
          foreground: '#f5f5f4',
          background: '#050A0D',
          gridGapDesktop: 8,
          gridGapMobile: 4,
          coverOverlayOpacity: 0.65,
        },
      },
      photos: rawPhotos.map((p, index) => {
        const width = p.imageMediaMetadata?.width || 3840;
        const height = p.imageMediaMetadata?.height || 2560;
        const photoId = `photo-${slug}-${String(index + 1).padStart(3, '0')}`;

        return {
          id: photoId,
          fileName: p.name,
          alt: `Fotografia ${index + 1} de ${folder.name}`,
          width,
          height,
          focalPoint: { x: 50, y: 50 },
          dominantColor: '#181b20',
          sources: buildImageSources(p.id, width, height),
          downloadUrl: `https://lh3.googleusercontent.com/d/${p.id}=s0`,
          shareUrl: `${p.id}`,
          position: index + 1,
          positionTieBreaker: p.name,
        };
      }),
    };

    const colFilePath = path.join(outDir, `${slug}.json`);
    fs.writeFileSync(colFilePath, JSON.stringify(collectionData, null, 2), 'utf-8');
    console.log(`   ✅ Arquivo gerado: src/data/collections/${slug}.json (${rawPhotos.length} fotos)`);

    collections.push({
      id: collectionData.collection.id,
      slug: collectionData.collection.slug,
      title: collectionData.collection.title,
      totalItems: collectionData.collection.totalItems,
      coverUrl:
        collectionData.collection.cover.sources[1]?.url ||
        collectionData.collection.cover.sources[0]?.url,
    });
  }

  const indexFilePath = path.join(outDir, 'index.json');
  fs.writeFileSync(indexFilePath, JSON.stringify(collections, null, 2), 'utf-8');
  console.log(
    `\n✨ Sincronização concluída! ${collections.length} coleções indexadas em src/data/collections/index.json`,
  );
}

sync().catch((err) => {
  console.error('❌ Falha na sincronização:', err);
  process.exit(1);
});

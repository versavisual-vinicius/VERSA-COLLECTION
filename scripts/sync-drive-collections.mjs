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

async function resolveFolder(item) {
  if (item.mimeType === 'application/vnd.google-apps.folder') {
    return { id: item.id, name: item.name };
  }
  if (item.mimeType === 'application/vnd.google-apps.shortcut' && item.shortcutDetails?.targetId) {
    try {
      const target = await drive.files.get({
        fileId: item.shortcutDetails.targetId,
        fields: 'id, name, mimeType',
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

async function fetchAllPhotosInFolder(folderId) {
  const photos = [];
  let pageToken = null;

  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'nextPageToken, files(id, name, mimeType, imageMediaMetadata, webViewLink, webContentLink, createdTime)',
      pageSize: 1000,
      pageToken,
    });

    if (res.data.files) {
      photos.push(...res.data.files);
    }
    pageToken = res.data.nextPageToken;
  } while (pageToken);

  return photos;
}

function buildImageSources(fileId, originalWidth, originalHeight) {
  const widths = [640, 1024, 2048, 3600];
  const sources = [];

  for (const w of widths) {
    if (originalWidth && w > originalWidth * 1.25) continue;
    const h = originalWidth && originalHeight ? Math.round((w * originalHeight) / originalWidth) : Math.round(w * 0.66);
    sources.push({
      url: `https://lh3.googleusercontent.com/d/${fileId}=w${w}`,
      width: w,
      height: h,
      format: 'jpeg',
    });
  }

  // Fonte original
  sources.push({
    url: `https://lh3.googleusercontent.com/d/${fileId}=s0`,
    width: originalWidth || 3840,
    height: originalHeight || 2560,
    format: 'jpeg',
  });

  return sources;
}

async function sync() {
  console.log('🔄 Iniciando sincronização do Google Drive...');
  console.log(`📁 Pasta Raiz: ${rootFolderId}`);

  // Listar itens na pasta raiz
  const rootItems = await drive.files.list({
    q: `'${rootFolderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType, shortcutDetails)',
  });

  const collections = [];
  const outDir = path.join(process.cwd(), 'src/data/collections');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const item of rootItems.data.files) {
    const folder = await resolveFolder(item);
    if (!folder) continue;

    const slug = slugify(folder.name);
    console.log(`\n📸 Processando coleção: "${folder.name}" (slug: ${slug})...`);

    const rawPhotos = await fetchAllPhotosInFolder(folder.id);
    console.log(`   Total de fotos encontradas: ${rawPhotos.length}`);
    if (rawPhotos.length === 0) continue;

    // Ordenação natural de arquivos
    rawPhotos.sort(naturalSort);

    // Encontrar foto com formato paisagem para capa, senão a primeira
    const landscapeCandidate = rawPhotos.find((p) => {
      const w = p.imageMediaMetadata?.width || 0;
      const h = p.imageMediaMetadata?.height || 0;
      return w > h;
    }) || rawPhotos[0];

    const coverWidth = landscapeCandidate.imageMediaMetadata?.width || 3840;
    const coverHeight = landscapeCandidate.imageMediaMetadata?.height || 2560;

    const collectionData = {
      collection: {
        id: `col-${slug}`,
        slug: slug,
        title: folder.name,
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
          gridGapDesktop: 6,
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

    // Salvar JSON individual da coleção
    const colFilePath = path.join(outDir, `${slug}.json`);
    fs.writeFileSync(colFilePath, JSON.stringify(collectionData, null, 2), 'utf-8');
    console.log(`   ✅ Arquivo gerado: src/data/collections/${slug}.json (${rawPhotos.length} fotos)`);

    collections.push({
      id: collectionData.collection.id,
      slug: collectionData.collection.slug,
      title: collectionData.collection.title,
      totalItems: collectionData.collection.totalItems,
      coverUrl: collectionData.collection.cover.sources[1]?.url || collectionData.collection.cover.sources[0]?.url,
    });
  }

  // Salvar índice geral de coleções
  const indexFilePath = path.join(outDir, 'index.json');
  fs.writeFileSync(indexFilePath, JSON.stringify(collections, null, 2), 'utf-8');
  console.log(`\n✨ Sincronização concluída! ${collections.length} coleções indexadas em src/data/collections/index.json`);
}

sync().catch((err) => {
  console.error('❌ Falha na sincronização:', err);
  process.exit(1);
});

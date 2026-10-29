-- Semente gerada automaticamente para Cloud SQL / PostgreSQL (Cloud Run)
BEGIN;

-- DDL canônica da tabela de favoritos (expurgando DDL em tempo de execução HTTP)
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id text NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  visitor_id text,
  client_email text,
  photo_id text NOT NULL,
  selected boolean NOT NULL DEFAULT true,
  note text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS favorites_lookup_idx ON public.favorites (collection_id, visitor_id, client_email);
CREATE INDEX IF NOT EXISTS favorites_photo_idx ON public.favorites (collection_id, photo_id);

-- Coleção: modec-dia-das-criancas-2026
INSERT INTO public.collections (
  id, slug, title, business_name, business_url, cover, cover_focal_point,
  visibility, password_required, access_password_hash, access_email_required,
  client_emails, favorites_enabled, downloads, download_pin_hash,
  sharing_enabled, slideshow_enabled, total_items, locale, theme,
  client_notes, updated_at
) VALUES (
  'col-modec-dia-das-criancas-2026',
  'modec-dia-das-criancas-2026',
  'MODEC DIA DAS CRIANÇAS 2026',
  'Versa Visual',
  'https://instagram.com/v1ncsc',
  '{"alt":"Capa da coleção MODEC DIA DAS CRIANÇAS 2026","width":5773,"height":3849,"dominantColor":"#12151a","sources":[{"url":"https://lh3.googleusercontent.com/d/16gB18JjIIPQwr7g7XOH4NbnIWN-dJn4a=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/16gB18JjIIPQwr7g7XOH4NbnIWN-dJn4a=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/16gB18JjIIPQwr7g7XOH4NbnIWN-dJn4a=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/16gB18JjIIPQwr7g7XOH4NbnIWN-dJn4a=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/16gB18JjIIPQwr7g7XOH4NbnIWN-dJn4a=s0","width":5773,"height":3849,"format":"jpeg"}]}'::jsonb,
  '{"x":50,"y":35}'::jsonb,
  'public',
  false,
  NULL,
  false,
  '{}'::text[],
  true,
  '{"enabled":true,"individualEnabled":true,"collectionEnabled":true,"requiresEmail":false,"requiresPin":false,"allowedSizes":["original","3600","2048","1024","640"]}'::jsonb,
  NULL,
  true,
  true,
  158,
  'pt-BR',
  '{"headingFont":"Outfit, sans-serif","bodyFont":"DM Sans, sans-serif","foreground":"#f5f5f4","background":"#050A0D","gridGapDesktop":6,"gridGapMobile":4,"coverOverlayOpacity":0.65}'::jsonb,
  NULL,
  '2026-10-29T01:49:11.420Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  business_name = EXCLUDED.business_name,
  business_url = EXCLUDED.business_url,
  cover = EXCLUDED.cover,
  cover_focal_point = EXCLUDED.cover_focal_point,
  visibility = EXCLUDED.visibility,
  password_required = EXCLUDED.password_required,
  access_password_hash = EXCLUDED.access_password_hash,
  access_email_required = EXCLUDED.access_email_required,
  client_emails = EXCLUDED.client_emails,
  favorites_enabled = EXCLUDED.favorites_enabled,
  downloads = EXCLUDED.downloads,
  download_pin_hash = EXCLUDED.download_pin_hash,
  sharing_enabled = EXCLUDED.sharing_enabled,
  slideshow_enabled = EXCLUDED.slideshow_enabled,
  total_items = EXCLUDED.total_items,
  locale = EXCLUDED.locale,
  theme = EXCLUDED.theme,
  client_notes = EXCLUDED.client_notes,
  updated_at = EXCLUDED.updated_at;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-001',
  'col-modec-dia-das-criancas-2026',
  NULL,
  1,
  '{"id":"photo-modec-dia-das-criancas-2026-001","fileName":"MODEC-1.jpg","alt":"Fotografia 1 de MODEC DIA DAS CRIANÇAS 2026","width":5773,"height":3849,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/16gB18JjIIPQwr7g7XOH4NbnIWN-dJn4a=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/16gB18JjIIPQwr7g7XOH4NbnIWN-dJn4a=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/16gB18JjIIPQwr7g7XOH4NbnIWN-dJn4a=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/16gB18JjIIPQwr7g7XOH4NbnIWN-dJn4a=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/16gB18JjIIPQwr7g7XOH4NbnIWN-dJn4a=s0","width":5773,"height":3849,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/16gB18JjIIPQwr7g7XOH4NbnIWN-dJn4a=s0","shareUrl":"16gB18JjIIPQwr7g7XOH4NbnIWN-dJn4a","position":1,"positionTieBreaker":"MODEC-1.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-002',
  'col-modec-dia-das-criancas-2026',
  NULL,
  2,
  '{"id":"photo-modec-dia-das-criancas-2026-002","fileName":"MODEC-2.jpg","alt":"Fotografia 2 de MODEC DIA DAS CRIANÇAS 2026","width":4024,"height":6036,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1RrV9nfy5KM062Ew2CcenS3WRdz264rq5=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1RrV9nfy5KM062Ew2CcenS3WRdz264rq5=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1RrV9nfy5KM062Ew2CcenS3WRdz264rq5=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1RrV9nfy5KM062Ew2CcenS3WRdz264rq5=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1RrV9nfy5KM062Ew2CcenS3WRdz264rq5=s0","width":4024,"height":6036,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1RrV9nfy5KM062Ew2CcenS3WRdz264rq5=s0","shareUrl":"1RrV9nfy5KM062Ew2CcenS3WRdz264rq5","position":2,"positionTieBreaker":"MODEC-2.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-003',
  'col-modec-dia-das-criancas-2026',
  NULL,
  3,
  '{"id":"photo-modec-dia-das-criancas-2026-003","fileName":"MODEC-3.jpg","alt":"Fotografia 3 de MODEC DIA DAS CRIANÇAS 2026","width":4024,"height":6036,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1eBbjffSXArmBUBNhPQmpSQwr6F9hpboo=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1eBbjffSXArmBUBNhPQmpSQwr6F9hpboo=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1eBbjffSXArmBUBNhPQmpSQwr6F9hpboo=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1eBbjffSXArmBUBNhPQmpSQwr6F9hpboo=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1eBbjffSXArmBUBNhPQmpSQwr6F9hpboo=s0","width":4024,"height":6036,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1eBbjffSXArmBUBNhPQmpSQwr6F9hpboo=s0","shareUrl":"1eBbjffSXArmBUBNhPQmpSQwr6F9hpboo","position":3,"positionTieBreaker":"MODEC-3.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-004',
  'col-modec-dia-das-criancas-2026',
  NULL,
  4,
  '{"id":"photo-modec-dia-das-criancas-2026-004","fileName":"MODEC-4.jpg","alt":"Fotografia 4 de MODEC DIA DAS CRIANÇAS 2026","width":5852,"height":3901,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1_0dmxxp7PPv7suNBkVjvpKITUCRD-cX1=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_0dmxxp7PPv7suNBkVjvpKITUCRD-cX1=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_0dmxxp7PPv7suNBkVjvpKITUCRD-cX1=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_0dmxxp7PPv7suNBkVjvpKITUCRD-cX1=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_0dmxxp7PPv7suNBkVjvpKITUCRD-cX1=s0","width":5852,"height":3901,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1_0dmxxp7PPv7suNBkVjvpKITUCRD-cX1=s0","shareUrl":"1_0dmxxp7PPv7suNBkVjvpKITUCRD-cX1","position":4,"positionTieBreaker":"MODEC-4.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-005',
  'col-modec-dia-das-criancas-2026',
  NULL,
  5,
  '{"id":"photo-modec-dia-das-criancas-2026-005","fileName":"MODEC-5.jpg","alt":"Fotografia 5 de MODEC DIA DAS CRIANÇAS 2026","width":4024,"height":6036,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1bExU11ykbis7e-OsfplTM5xaGGXVYZyU=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1bExU11ykbis7e-OsfplTM5xaGGXVYZyU=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1bExU11ykbis7e-OsfplTM5xaGGXVYZyU=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1bExU11ykbis7e-OsfplTM5xaGGXVYZyU=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1bExU11ykbis7e-OsfplTM5xaGGXVYZyU=s0","width":4024,"height":6036,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1bExU11ykbis7e-OsfplTM5xaGGXVYZyU=s0","shareUrl":"1bExU11ykbis7e-OsfplTM5xaGGXVYZyU","position":5,"positionTieBreaker":"MODEC-5.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-006',
  'col-modec-dia-das-criancas-2026',
  NULL,
  6,
  '{"id":"photo-modec-dia-das-criancas-2026-006","fileName":"MODEC-6.jpg","alt":"Fotografia 6 de MODEC DIA DAS CRIANÇAS 2026","width":2327,"height":3491,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1OQr0mzlWxeAcjSB8zW8NKGlwTOsSJG40=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1OQr0mzlWxeAcjSB8zW8NKGlwTOsSJG40=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1OQr0mzlWxeAcjSB8zW8NKGlwTOsSJG40=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1OQr0mzlWxeAcjSB8zW8NKGlwTOsSJG40=s0","width":2327,"height":3491,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1OQr0mzlWxeAcjSB8zW8NKGlwTOsSJG40=s0","shareUrl":"1OQr0mzlWxeAcjSB8zW8NKGlwTOsSJG40","position":6,"positionTieBreaker":"MODEC-6.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-007',
  'col-modec-dia-das-criancas-2026',
  NULL,
  7,
  '{"id":"photo-modec-dia-das-criancas-2026-007","fileName":"MODEC-7.jpg","alt":"Fotografia 7 de MODEC DIA DAS CRIANÇAS 2026","width":6036,"height":4024,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/15Cae9OVbIDyMvMyUCF7v0qqhxL2y66BS=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/15Cae9OVbIDyMvMyUCF7v0qqhxL2y66BS=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/15Cae9OVbIDyMvMyUCF7v0qqhxL2y66BS=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/15Cae9OVbIDyMvMyUCF7v0qqhxL2y66BS=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/15Cae9OVbIDyMvMyUCF7v0qqhxL2y66BS=s0","width":6036,"height":4024,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/15Cae9OVbIDyMvMyUCF7v0qqhxL2y66BS=s0","shareUrl":"15Cae9OVbIDyMvMyUCF7v0qqhxL2y66BS","position":7,"positionTieBreaker":"MODEC-7.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-008',
  'col-modec-dia-das-criancas-2026',
  NULL,
  8,
  '{"id":"photo-modec-dia-das-criancas-2026-008","fileName":"MODEC-8.jpg","alt":"Fotografia 8 de MODEC DIA DAS CRIANÇAS 2026","width":6036,"height":4024,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1TwIvXV2Wg_Iqdo7jrLeOejuzHfvM8m54=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TwIvXV2Wg_Iqdo7jrLeOejuzHfvM8m54=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TwIvXV2Wg_Iqdo7jrLeOejuzHfvM8m54=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TwIvXV2Wg_Iqdo7jrLeOejuzHfvM8m54=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TwIvXV2Wg_Iqdo7jrLeOejuzHfvM8m54=s0","width":6036,"height":4024,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1TwIvXV2Wg_Iqdo7jrLeOejuzHfvM8m54=s0","shareUrl":"1TwIvXV2Wg_Iqdo7jrLeOejuzHfvM8m54","position":8,"positionTieBreaker":"MODEC-8.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-009',
  'col-modec-dia-das-criancas-2026',
  NULL,
  9,
  '{"id":"photo-modec-dia-das-criancas-2026-009","fileName":"MODEC-9.jpg","alt":"Fotografia 9 de MODEC DIA DAS CRIANÇAS 2026","width":3672,"height":5508,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1Gyicu9ES76bqrWVbDjyrPCgoBe-Ws9ci=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Gyicu9ES76bqrWVbDjyrPCgoBe-Ws9ci=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Gyicu9ES76bqrWVbDjyrPCgoBe-Ws9ci=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Gyicu9ES76bqrWVbDjyrPCgoBe-Ws9ci=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Gyicu9ES76bqrWVbDjyrPCgoBe-Ws9ci=s0","width":3672,"height":5508,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1Gyicu9ES76bqrWVbDjyrPCgoBe-Ws9ci=s0","shareUrl":"1Gyicu9ES76bqrWVbDjyrPCgoBe-Ws9ci","position":9,"positionTieBreaker":"MODEC-9.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-010',
  'col-modec-dia-das-criancas-2026',
  NULL,
  10,
  '{"id":"photo-modec-dia-das-criancas-2026-010","fileName":"MODEC-10.jpg","alt":"Fotografia 10 de MODEC DIA DAS CRIANÇAS 2026","width":3742,"height":5613,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1edVE_mIbgVnQ-nWpsAamTMS9rOtK2dls=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1edVE_mIbgVnQ-nWpsAamTMS9rOtK2dls=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1edVE_mIbgVnQ-nWpsAamTMS9rOtK2dls=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1edVE_mIbgVnQ-nWpsAamTMS9rOtK2dls=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1edVE_mIbgVnQ-nWpsAamTMS9rOtK2dls=s0","width":3742,"height":5613,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1edVE_mIbgVnQ-nWpsAamTMS9rOtK2dls=s0","shareUrl":"1edVE_mIbgVnQ-nWpsAamTMS9rOtK2dls","position":10,"positionTieBreaker":"MODEC-10.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-011',
  'col-modec-dia-das-criancas-2026',
  NULL,
  11,
  '{"id":"photo-modec-dia-das-criancas-2026-011","fileName":"MODEC-11.jpg","alt":"Fotografia 11 de MODEC DIA DAS CRIANÇAS 2026","width":3752,"height":5628,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/18Ks9uJ_cIVaitmhojXsx9DbEQniDp0fl=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/18Ks9uJ_cIVaitmhojXsx9DbEQniDp0fl=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/18Ks9uJ_cIVaitmhojXsx9DbEQniDp0fl=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/18Ks9uJ_cIVaitmhojXsx9DbEQniDp0fl=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/18Ks9uJ_cIVaitmhojXsx9DbEQniDp0fl=s0","width":3752,"height":5628,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/18Ks9uJ_cIVaitmhojXsx9DbEQniDp0fl=s0","shareUrl":"18Ks9uJ_cIVaitmhojXsx9DbEQniDp0fl","position":11,"positionTieBreaker":"MODEC-11.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-012',
  'col-modec-dia-das-criancas-2026',
  NULL,
  12,
  '{"id":"photo-modec-dia-das-criancas-2026-012","fileName":"MODEC-12.jpg","alt":"Fotografia 12 de MODEC DIA DAS CRIANÇAS 2026","width":5710,"height":3807,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/10DGPnEQ3jtx_Gjgf0gbo-8lkKoSsFbdU=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/10DGPnEQ3jtx_Gjgf0gbo-8lkKoSsFbdU=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/10DGPnEQ3jtx_Gjgf0gbo-8lkKoSsFbdU=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/10DGPnEQ3jtx_Gjgf0gbo-8lkKoSsFbdU=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/10DGPnEQ3jtx_Gjgf0gbo-8lkKoSsFbdU=s0","width":5710,"height":3807,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/10DGPnEQ3jtx_Gjgf0gbo-8lkKoSsFbdU=s0","shareUrl":"10DGPnEQ3jtx_Gjgf0gbo-8lkKoSsFbdU","position":12,"positionTieBreaker":"MODEC-12.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-013',
  'col-modec-dia-das-criancas-2026',
  NULL,
  13,
  '{"id":"photo-modec-dia-das-criancas-2026-013","fileName":"MODEC-13.jpg","alt":"Fotografia 13 de MODEC DIA DAS CRIANÇAS 2026","width":3868,"height":5802,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1NTnpBEiUDNhCg1yRZQz1PO4cPazx8ti1=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1NTnpBEiUDNhCg1yRZQz1PO4cPazx8ti1=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1NTnpBEiUDNhCg1yRZQz1PO4cPazx8ti1=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1NTnpBEiUDNhCg1yRZQz1PO4cPazx8ti1=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1NTnpBEiUDNhCg1yRZQz1PO4cPazx8ti1=s0","width":3868,"height":5802,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1NTnpBEiUDNhCg1yRZQz1PO4cPazx8ti1=s0","shareUrl":"1NTnpBEiUDNhCg1yRZQz1PO4cPazx8ti1","position":13,"positionTieBreaker":"MODEC-13.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-014',
  'col-modec-dia-das-criancas-2026',
  NULL,
  14,
  '{"id":"photo-modec-dia-das-criancas-2026-014","fileName":"MODEC-14.jpg","alt":"Fotografia 14 de MODEC DIA DAS CRIANÇAS 2026","width":3586,"height":5162,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1ZOHPA6eZCS397Jnr5v7ChtEe-WIsfyiQ=w640","width":640,"height":921,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZOHPA6eZCS397Jnr5v7ChtEe-WIsfyiQ=w1024","width":1024,"height":1474,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZOHPA6eZCS397Jnr5v7ChtEe-WIsfyiQ=w2048","width":2048,"height":2948,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZOHPA6eZCS397Jnr5v7ChtEe-WIsfyiQ=w3600","width":3600,"height":5182,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZOHPA6eZCS397Jnr5v7ChtEe-WIsfyiQ=s0","width":3586,"height":5162,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1ZOHPA6eZCS397Jnr5v7ChtEe-WIsfyiQ=s0","shareUrl":"1ZOHPA6eZCS397Jnr5v7ChtEe-WIsfyiQ","position":14,"positionTieBreaker":"MODEC-14.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-015',
  'col-modec-dia-das-criancas-2026',
  NULL,
  15,
  '{"id":"photo-modec-dia-das-criancas-2026-015","fileName":"MODEC-15.jpg","alt":"Fotografia 15 de MODEC DIA DAS CRIANÇAS 2026","width":6036,"height":4024,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/11SYC9LK_J0Kq-hhZLrtaupUzpD4TTjUz=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/11SYC9LK_J0Kq-hhZLrtaupUzpD4TTjUz=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/11SYC9LK_J0Kq-hhZLrtaupUzpD4TTjUz=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/11SYC9LK_J0Kq-hhZLrtaupUzpD4TTjUz=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/11SYC9LK_J0Kq-hhZLrtaupUzpD4TTjUz=s0","width":6036,"height":4024,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/11SYC9LK_J0Kq-hhZLrtaupUzpD4TTjUz=s0","shareUrl":"11SYC9LK_J0Kq-hhZLrtaupUzpD4TTjUz","position":15,"positionTieBreaker":"MODEC-15.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-016',
  'col-modec-dia-das-criancas-2026',
  NULL,
  16,
  '{"id":"photo-modec-dia-das-criancas-2026-016","fileName":"MODEC-16.jpg","alt":"Fotografia 16 de MODEC DIA DAS CRIANÇAS 2026","width":5544,"height":3696,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1mfVNVZYBlBMiTYTsCpxyVJ6vjv_hoX0a=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1mfVNVZYBlBMiTYTsCpxyVJ6vjv_hoX0a=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1mfVNVZYBlBMiTYTsCpxyVJ6vjv_hoX0a=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1mfVNVZYBlBMiTYTsCpxyVJ6vjv_hoX0a=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1mfVNVZYBlBMiTYTsCpxyVJ6vjv_hoX0a=s0","width":5544,"height":3696,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1mfVNVZYBlBMiTYTsCpxyVJ6vjv_hoX0a=s0","shareUrl":"1mfVNVZYBlBMiTYTsCpxyVJ6vjv_hoX0a","position":16,"positionTieBreaker":"MODEC-16.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-017',
  'col-modec-dia-das-criancas-2026',
  NULL,
  17,
  '{"id":"photo-modec-dia-das-criancas-2026-017","fileName":"MODEC-17.jpg","alt":"Fotografia 17 de MODEC DIA DAS CRIANÇAS 2026","width":5199,"height":3466,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1xpb_-BtckoytW0TfutErQc9V8UJRdoi1=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1xpb_-BtckoytW0TfutErQc9V8UJRdoi1=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1xpb_-BtckoytW0TfutErQc9V8UJRdoi1=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1xpb_-BtckoytW0TfutErQc9V8UJRdoi1=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1xpb_-BtckoytW0TfutErQc9V8UJRdoi1=s0","width":5199,"height":3466,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1xpb_-BtckoytW0TfutErQc9V8UJRdoi1=s0","shareUrl":"1xpb_-BtckoytW0TfutErQc9V8UJRdoi1","position":17,"positionTieBreaker":"MODEC-17.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-018',
  'col-modec-dia-das-criancas-2026',
  NULL,
  18,
  '{"id":"photo-modec-dia-das-criancas-2026-018","fileName":"MODEC-18.jpg","alt":"Fotografia 18 de MODEC DIA DAS CRIANÇAS 2026","width":3385,"height":5078,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1_49kvyd5Tn4Al3debENoNAa-6RhCVcn6=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_49kvyd5Tn4Al3debENoNAa-6RhCVcn6=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_49kvyd5Tn4Al3debENoNAa-6RhCVcn6=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_49kvyd5Tn4Al3debENoNAa-6RhCVcn6=w3600","width":3600,"height":5401,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_49kvyd5Tn4Al3debENoNAa-6RhCVcn6=s0","width":3385,"height":5078,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1_49kvyd5Tn4Al3debENoNAa-6RhCVcn6=s0","shareUrl":"1_49kvyd5Tn4Al3debENoNAa-6RhCVcn6","position":18,"positionTieBreaker":"MODEC-18.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-019',
  'col-modec-dia-das-criancas-2026',
  NULL,
  19,
  '{"id":"photo-modec-dia-das-criancas-2026-019","fileName":"MODEC-19.jpg","alt":"Fotografia 19 de MODEC DIA DAS CRIANÇAS 2026","width":3851,"height":5777,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1j7RjNoI4d4UC1rxoFVKnAMFEiMxeloId=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1j7RjNoI4d4UC1rxoFVKnAMFEiMxeloId=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1j7RjNoI4d4UC1rxoFVKnAMFEiMxeloId=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1j7RjNoI4d4UC1rxoFVKnAMFEiMxeloId=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1j7RjNoI4d4UC1rxoFVKnAMFEiMxeloId=s0","width":3851,"height":5777,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1j7RjNoI4d4UC1rxoFVKnAMFEiMxeloId=s0","shareUrl":"1j7RjNoI4d4UC1rxoFVKnAMFEiMxeloId","position":19,"positionTieBreaker":"MODEC-19.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-020',
  'col-modec-dia-das-criancas-2026',
  NULL,
  20,
  '{"id":"photo-modec-dia-das-criancas-2026-020","fileName":"MODEC-20.jpg","alt":"Fotografia 20 de MODEC DIA DAS CRIANÇAS 2026","width":5741,"height":3827,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1NqaUf9TbpgPpy-NMGiaRm7Zm5Yu32r5d=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1NqaUf9TbpgPpy-NMGiaRm7Zm5Yu32r5d=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1NqaUf9TbpgPpy-NMGiaRm7Zm5Yu32r5d=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1NqaUf9TbpgPpy-NMGiaRm7Zm5Yu32r5d=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1NqaUf9TbpgPpy-NMGiaRm7Zm5Yu32r5d=s0","width":5741,"height":3827,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1NqaUf9TbpgPpy-NMGiaRm7Zm5Yu32r5d=s0","shareUrl":"1NqaUf9TbpgPpy-NMGiaRm7Zm5Yu32r5d","position":20,"positionTieBreaker":"MODEC-20.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-021',
  'col-modec-dia-das-criancas-2026',
  NULL,
  21,
  '{"id":"photo-modec-dia-das-criancas-2026-021","fileName":"MODEC-21.jpg","alt":"Fotografia 21 de MODEC DIA DAS CRIANÇAS 2026","width":5493,"height":3662,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/15r7jv121NV_2M-u_Pg7ZuKiJjFn-QWyT=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/15r7jv121NV_2M-u_Pg7ZuKiJjFn-QWyT=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/15r7jv121NV_2M-u_Pg7ZuKiJjFn-QWyT=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/15r7jv121NV_2M-u_Pg7ZuKiJjFn-QWyT=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/15r7jv121NV_2M-u_Pg7ZuKiJjFn-QWyT=s0","width":5493,"height":3662,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/15r7jv121NV_2M-u_Pg7ZuKiJjFn-QWyT=s0","shareUrl":"15r7jv121NV_2M-u_Pg7ZuKiJjFn-QWyT","position":21,"positionTieBreaker":"MODEC-21.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-022',
  'col-modec-dia-das-criancas-2026',
  NULL,
  22,
  '{"id":"photo-modec-dia-das-criancas-2026-022","fileName":"MODEC-22.jpg","alt":"Fotografia 22 de MODEC DIA DAS CRIANÇAS 2026","width":3936,"height":2624,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1YMZaYVGSMz7uH7u1rmy1wMtf83J16TmZ=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1YMZaYVGSMz7uH7u1rmy1wMtf83J16TmZ=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1YMZaYVGSMz7uH7u1rmy1wMtf83J16TmZ=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1YMZaYVGSMz7uH7u1rmy1wMtf83J16TmZ=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1YMZaYVGSMz7uH7u1rmy1wMtf83J16TmZ=s0","width":3936,"height":2624,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1YMZaYVGSMz7uH7u1rmy1wMtf83J16TmZ=s0","shareUrl":"1YMZaYVGSMz7uH7u1rmy1wMtf83J16TmZ","position":22,"positionTieBreaker":"MODEC-22.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-023',
  'col-modec-dia-das-criancas-2026',
  NULL,
  23,
  '{"id":"photo-modec-dia-das-criancas-2026-023","fileName":"MODEC-23.jpg","alt":"Fotografia 23 de MODEC DIA DAS CRIANÇAS 2026","width":3936,"height":2624,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1TKPnCxxvv5Y87f1cNbgqUEYp2eeMx2Ph=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TKPnCxxvv5Y87f1cNbgqUEYp2eeMx2Ph=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TKPnCxxvv5Y87f1cNbgqUEYp2eeMx2Ph=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TKPnCxxvv5Y87f1cNbgqUEYp2eeMx2Ph=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TKPnCxxvv5Y87f1cNbgqUEYp2eeMx2Ph=s0","width":3936,"height":2624,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1TKPnCxxvv5Y87f1cNbgqUEYp2eeMx2Ph=s0","shareUrl":"1TKPnCxxvv5Y87f1cNbgqUEYp2eeMx2Ph","position":23,"positionTieBreaker":"MODEC-23.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-024',
  'col-modec-dia-das-criancas-2026',
  NULL,
  24,
  '{"id":"photo-modec-dia-das-criancas-2026-024","fileName":"MODEC-24.jpg","alt":"Fotografia 24 de MODEC DIA DAS CRIANÇAS 2026","width":3624,"height":2416,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1wuxyX17Zfrmqm9mr_Mc-RPZXlhGrrpeP=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1wuxyX17Zfrmqm9mr_Mc-RPZXlhGrrpeP=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1wuxyX17Zfrmqm9mr_Mc-RPZXlhGrrpeP=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1wuxyX17Zfrmqm9mr_Mc-RPZXlhGrrpeP=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1wuxyX17Zfrmqm9mr_Mc-RPZXlhGrrpeP=s0","width":3624,"height":2416,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1wuxyX17Zfrmqm9mr_Mc-RPZXlhGrrpeP=s0","shareUrl":"1wuxyX17Zfrmqm9mr_Mc-RPZXlhGrrpeP","position":24,"positionTieBreaker":"MODEC-24.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-025',
  'col-modec-dia-das-criancas-2026',
  NULL,
  25,
  '{"id":"photo-modec-dia-das-criancas-2026-025","fileName":"MODEC-25.jpg","alt":"Fotografia 25 de MODEC DIA DAS CRIANÇAS 2026","width":3918,"height":2612,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1g0TO3d6jMGLTwkIdiKg17Mnsg-HV84k1=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1g0TO3d6jMGLTwkIdiKg17Mnsg-HV84k1=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1g0TO3d6jMGLTwkIdiKg17Mnsg-HV84k1=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1g0TO3d6jMGLTwkIdiKg17Mnsg-HV84k1=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1g0TO3d6jMGLTwkIdiKg17Mnsg-HV84k1=s0","width":3918,"height":2612,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1g0TO3d6jMGLTwkIdiKg17Mnsg-HV84k1=s0","shareUrl":"1g0TO3d6jMGLTwkIdiKg17Mnsg-HV84k1","position":25,"positionTieBreaker":"MODEC-25.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-026',
  'col-modec-dia-das-criancas-2026',
  NULL,
  26,
  '{"id":"photo-modec-dia-das-criancas-2026-026","fileName":"MODEC-26.jpg","alt":"Fotografia 26 de MODEC DIA DAS CRIANÇAS 2026","width":3771,"height":2514,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1nzyuCCtpgF_nVYDq3sfy41NHz2OOP0i1=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1nzyuCCtpgF_nVYDq3sfy41NHz2OOP0i1=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1nzyuCCtpgF_nVYDq3sfy41NHz2OOP0i1=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1nzyuCCtpgF_nVYDq3sfy41NHz2OOP0i1=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1nzyuCCtpgF_nVYDq3sfy41NHz2OOP0i1=s0","width":3771,"height":2514,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1nzyuCCtpgF_nVYDq3sfy41NHz2OOP0i1=s0","shareUrl":"1nzyuCCtpgF_nVYDq3sfy41NHz2OOP0i1","position":26,"positionTieBreaker":"MODEC-26.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-027',
  'col-modec-dia-das-criancas-2026',
  NULL,
  27,
  '{"id":"photo-modec-dia-das-criancas-2026-027","fileName":"MODEC-27.jpg","alt":"Fotografia 27 de MODEC DIA DAS CRIANÇAS 2026","width":3254,"height":4881,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1UFFNKTn7tqhfyfnC3x-Wfr1TIMaArdd6=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1UFFNKTn7tqhfyfnC3x-Wfr1TIMaArdd6=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1UFFNKTn7tqhfyfnC3x-Wfr1TIMaArdd6=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1UFFNKTn7tqhfyfnC3x-Wfr1TIMaArdd6=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1UFFNKTn7tqhfyfnC3x-Wfr1TIMaArdd6=s0","width":3254,"height":4881,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1UFFNKTn7tqhfyfnC3x-Wfr1TIMaArdd6=s0","shareUrl":"1UFFNKTn7tqhfyfnC3x-Wfr1TIMaArdd6","position":27,"positionTieBreaker":"MODEC-27.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-028',
  'col-modec-dia-das-criancas-2026',
  NULL,
  28,
  '{"id":"photo-modec-dia-das-criancas-2026-028","fileName":"MODEC-28.jpg","alt":"Fotografia 28 de MODEC DIA DAS CRIANÇAS 2026","width":2292,"height":3438,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1Rlhgf_jTMT5trG5PaUEQ3x_ANBZWyO4D=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Rlhgf_jTMT5trG5PaUEQ3x_ANBZWyO4D=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Rlhgf_jTMT5trG5PaUEQ3x_ANBZWyO4D=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Rlhgf_jTMT5trG5PaUEQ3x_ANBZWyO4D=s0","width":2292,"height":3438,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1Rlhgf_jTMT5trG5PaUEQ3x_ANBZWyO4D=s0","shareUrl":"1Rlhgf_jTMT5trG5PaUEQ3x_ANBZWyO4D","position":28,"positionTieBreaker":"MODEC-28.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-029',
  'col-modec-dia-das-criancas-2026',
  NULL,
  29,
  '{"id":"photo-modec-dia-das-criancas-2026-029","fileName":"MODEC-29.jpg","alt":"Fotografia 29 de MODEC DIA DAS CRIANÇAS 2026","width":2224,"height":3336,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1Er45guEI2lfUNXbUha05fVmUaAgRm4_g=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Er45guEI2lfUNXbUha05fVmUaAgRm4_g=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Er45guEI2lfUNXbUha05fVmUaAgRm4_g=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Er45guEI2lfUNXbUha05fVmUaAgRm4_g=s0","width":2224,"height":3336,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1Er45guEI2lfUNXbUha05fVmUaAgRm4_g=s0","shareUrl":"1Er45guEI2lfUNXbUha05fVmUaAgRm4_g","position":29,"positionTieBreaker":"MODEC-29.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-030',
  'col-modec-dia-das-criancas-2026',
  NULL,
  30,
  '{"id":"photo-modec-dia-das-criancas-2026-030","fileName":"MODEC-30.jpg","alt":"Fotografia 30 de MODEC DIA DAS CRIANÇAS 2026","width":2543,"height":3815,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1Gg2qvdu0-MtM-H1aaLO5LvbLZrR5PWYz=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Gg2qvdu0-MtM-H1aaLO5LvbLZrR5PWYz=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Gg2qvdu0-MtM-H1aaLO5LvbLZrR5PWYz=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Gg2qvdu0-MtM-H1aaLO5LvbLZrR5PWYz=s0","width":2543,"height":3815,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1Gg2qvdu0-MtM-H1aaLO5LvbLZrR5PWYz=s0","shareUrl":"1Gg2qvdu0-MtM-H1aaLO5LvbLZrR5PWYz","position":30,"positionTieBreaker":"MODEC-30.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-031',
  'col-modec-dia-das-criancas-2026',
  NULL,
  31,
  '{"id":"photo-modec-dia-das-criancas-2026-031","fileName":"MODEC-31.jpg","alt":"Fotografia 31 de MODEC DIA DAS CRIANÇAS 2026","width":3886,"height":5829,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1l9MCfrCuwMRbp8GHqxXAJ-NPzGgKkX7V=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1l9MCfrCuwMRbp8GHqxXAJ-NPzGgKkX7V=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1l9MCfrCuwMRbp8GHqxXAJ-NPzGgKkX7V=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1l9MCfrCuwMRbp8GHqxXAJ-NPzGgKkX7V=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1l9MCfrCuwMRbp8GHqxXAJ-NPzGgKkX7V=s0","width":3886,"height":5829,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1l9MCfrCuwMRbp8GHqxXAJ-NPzGgKkX7V=s0","shareUrl":"1l9MCfrCuwMRbp8GHqxXAJ-NPzGgKkX7V","position":31,"positionTieBreaker":"MODEC-31.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-032',
  'col-modec-dia-das-criancas-2026',
  NULL,
  32,
  '{"id":"photo-modec-dia-das-criancas-2026-032","fileName":"MODEC-32.jpg","alt":"Fotografia 32 de MODEC DIA DAS CRIANÇAS 2026","width":5542,"height":3695,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1BXpv9REOJjgJWCDymH4d0uqq8dWBeEit=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1BXpv9REOJjgJWCDymH4d0uqq8dWBeEit=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1BXpv9REOJjgJWCDymH4d0uqq8dWBeEit=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1BXpv9REOJjgJWCDymH4d0uqq8dWBeEit=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1BXpv9REOJjgJWCDymH4d0uqq8dWBeEit=s0","width":5542,"height":3695,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1BXpv9REOJjgJWCDymH4d0uqq8dWBeEit=s0","shareUrl":"1BXpv9REOJjgJWCDymH4d0uqq8dWBeEit","position":32,"positionTieBreaker":"MODEC-32.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-033',
  'col-modec-dia-das-criancas-2026',
  NULL,
  33,
  '{"id":"photo-modec-dia-das-criancas-2026-033","fileName":"MODEC-33.jpg","alt":"Fotografia 33 de MODEC DIA DAS CRIANÇAS 2026","width":5437,"height":3625,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1W6896nETxVmf6LfwW46RjAcKti50n6ZS=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1W6896nETxVmf6LfwW46RjAcKti50n6ZS=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1W6896nETxVmf6LfwW46RjAcKti50n6ZS=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1W6896nETxVmf6LfwW46RjAcKti50n6ZS=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1W6896nETxVmf6LfwW46RjAcKti50n6ZS=s0","width":5437,"height":3625,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1W6896nETxVmf6LfwW46RjAcKti50n6ZS=s0","shareUrl":"1W6896nETxVmf6LfwW46RjAcKti50n6ZS","position":33,"positionTieBreaker":"MODEC-33.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-034',
  'col-modec-dia-das-criancas-2026',
  NULL,
  34,
  '{"id":"photo-modec-dia-das-criancas-2026-034","fileName":"MODEC-34.jpg","alt":"Fotografia 34 de MODEC DIA DAS CRIANÇAS 2026","width":3837,"height":5756,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1TEEFL4YNXnIYtJ8lmTLMbcrSwcEslaeW=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TEEFL4YNXnIYtJ8lmTLMbcrSwcEslaeW=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TEEFL4YNXnIYtJ8lmTLMbcrSwcEslaeW=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TEEFL4YNXnIYtJ8lmTLMbcrSwcEslaeW=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TEEFL4YNXnIYtJ8lmTLMbcrSwcEslaeW=s0","width":3837,"height":5756,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1TEEFL4YNXnIYtJ8lmTLMbcrSwcEslaeW=s0","shareUrl":"1TEEFL4YNXnIYtJ8lmTLMbcrSwcEslaeW","position":34,"positionTieBreaker":"MODEC-34.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-035',
  'col-modec-dia-das-criancas-2026',
  NULL,
  35,
  '{"id":"photo-modec-dia-das-criancas-2026-035","fileName":"MODEC-35.jpg","alt":"Fotografia 35 de MODEC DIA DAS CRIANÇAS 2026","width":3719,"height":5579,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1s_t5lmb3Eg4xbweWSfXq7BQkn5AVyKUl=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1s_t5lmb3Eg4xbweWSfXq7BQkn5AVyKUl=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1s_t5lmb3Eg4xbweWSfXq7BQkn5AVyKUl=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1s_t5lmb3Eg4xbweWSfXq7BQkn5AVyKUl=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1s_t5lmb3Eg4xbweWSfXq7BQkn5AVyKUl=s0","width":3719,"height":5579,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1s_t5lmb3Eg4xbweWSfXq7BQkn5AVyKUl=s0","shareUrl":"1s_t5lmb3Eg4xbweWSfXq7BQkn5AVyKUl","position":35,"positionTieBreaker":"MODEC-35.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-036',
  'col-modec-dia-das-criancas-2026',
  NULL,
  36,
  '{"id":"photo-modec-dia-das-criancas-2026-036","fileName":"MODEC-36.jpg","alt":"Fotografia 36 de MODEC DIA DAS CRIANÇAS 2026","width":3424,"height":5136,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1ghcbN_ZrVMOU_Kwd0E-HbI3l0j3Pym0q=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ghcbN_ZrVMOU_Kwd0E-HbI3l0j3Pym0q=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ghcbN_ZrVMOU_Kwd0E-HbI3l0j3Pym0q=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ghcbN_ZrVMOU_Kwd0E-HbI3l0j3Pym0q=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ghcbN_ZrVMOU_Kwd0E-HbI3l0j3Pym0q=s0","width":3424,"height":5136,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1ghcbN_ZrVMOU_Kwd0E-HbI3l0j3Pym0q=s0","shareUrl":"1ghcbN_ZrVMOU_Kwd0E-HbI3l0j3Pym0q","position":36,"positionTieBreaker":"MODEC-36.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-037',
  'col-modec-dia-das-criancas-2026',
  NULL,
  37,
  '{"id":"photo-modec-dia-das-criancas-2026-037","fileName":"MODEC-37.jpg","alt":"Fotografia 37 de MODEC DIA DAS CRIANÇAS 2026","width":3403,"height":5104,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/16pGoI4J_iad6t-3akFVjhompSRfps60l=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/16pGoI4J_iad6t-3akFVjhompSRfps60l=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/16pGoI4J_iad6t-3akFVjhompSRfps60l=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/16pGoI4J_iad6t-3akFVjhompSRfps60l=w3600","width":3600,"height":5399,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/16pGoI4J_iad6t-3akFVjhompSRfps60l=s0","width":3403,"height":5104,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/16pGoI4J_iad6t-3akFVjhompSRfps60l=s0","shareUrl":"16pGoI4J_iad6t-3akFVjhompSRfps60l","position":37,"positionTieBreaker":"MODEC-37.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-038',
  'col-modec-dia-das-criancas-2026',
  NULL,
  38,
  '{"id":"photo-modec-dia-das-criancas-2026-038","fileName":"MODEC-38.jpg","alt":"Fotografia 38 de MODEC DIA DAS CRIANÇAS 2026","width":3658,"height":5487,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1LBHDBUcFamw-A37aybqnwg9qiK9TAodH=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1LBHDBUcFamw-A37aybqnwg9qiK9TAodH=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1LBHDBUcFamw-A37aybqnwg9qiK9TAodH=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1LBHDBUcFamw-A37aybqnwg9qiK9TAodH=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1LBHDBUcFamw-A37aybqnwg9qiK9TAodH=s0","width":3658,"height":5487,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1LBHDBUcFamw-A37aybqnwg9qiK9TAodH=s0","shareUrl":"1LBHDBUcFamw-A37aybqnwg9qiK9TAodH","position":38,"positionTieBreaker":"MODEC-38.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-039',
  'col-modec-dia-das-criancas-2026',
  NULL,
  39,
  '{"id":"photo-modec-dia-das-criancas-2026-039","fileName":"MODEC-39.jpg","alt":"Fotografia 39 de MODEC DIA DAS CRIANÇAS 2026","width":3877,"height":5816,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1o_rSxHcrtzMN33EHD04AmPY12hSgLkXP=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1o_rSxHcrtzMN33EHD04AmPY12hSgLkXP=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1o_rSxHcrtzMN33EHD04AmPY12hSgLkXP=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1o_rSxHcrtzMN33EHD04AmPY12hSgLkXP=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1o_rSxHcrtzMN33EHD04AmPY12hSgLkXP=s0","width":3877,"height":5816,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1o_rSxHcrtzMN33EHD04AmPY12hSgLkXP=s0","shareUrl":"1o_rSxHcrtzMN33EHD04AmPY12hSgLkXP","position":39,"positionTieBreaker":"MODEC-39.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-040',
  'col-modec-dia-das-criancas-2026',
  NULL,
  40,
  '{"id":"photo-modec-dia-das-criancas-2026-040","fileName":"MODEC-40.jpg","alt":"Fotografia 40 de MODEC DIA DAS CRIANÇAS 2026","width":3807,"height":5711,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1wuiI6YYDkaXmeTXGyPHW4kzd7dmEXJCq=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1wuiI6YYDkaXmeTXGyPHW4kzd7dmEXJCq=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1wuiI6YYDkaXmeTXGyPHW4kzd7dmEXJCq=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1wuiI6YYDkaXmeTXGyPHW4kzd7dmEXJCq=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1wuiI6YYDkaXmeTXGyPHW4kzd7dmEXJCq=s0","width":3807,"height":5711,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1wuiI6YYDkaXmeTXGyPHW4kzd7dmEXJCq=s0","shareUrl":"1wuiI6YYDkaXmeTXGyPHW4kzd7dmEXJCq","position":40,"positionTieBreaker":"MODEC-40.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-041',
  'col-modec-dia-das-criancas-2026',
  NULL,
  41,
  '{"id":"photo-modec-dia-das-criancas-2026-041","fileName":"MODEC-41.jpg","alt":"Fotografia 41 de MODEC DIA DAS CRIANÇAS 2026","width":5638,"height":3759,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1KvKw2TrCm8zIQiMbeByZEZoBB05ZAwfj=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1KvKw2TrCm8zIQiMbeByZEZoBB05ZAwfj=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1KvKw2TrCm8zIQiMbeByZEZoBB05ZAwfj=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1KvKw2TrCm8zIQiMbeByZEZoBB05ZAwfj=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1KvKw2TrCm8zIQiMbeByZEZoBB05ZAwfj=s0","width":5638,"height":3759,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1KvKw2TrCm8zIQiMbeByZEZoBB05ZAwfj=s0","shareUrl":"1KvKw2TrCm8zIQiMbeByZEZoBB05ZAwfj","position":41,"positionTieBreaker":"MODEC-41.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-042',
  'col-modec-dia-das-criancas-2026',
  NULL,
  42,
  '{"id":"photo-modec-dia-das-criancas-2026-042","fileName":"MODEC-42.jpg","alt":"Fotografia 42 de MODEC DIA DAS CRIANÇAS 2026","width":4024,"height":6036,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1uk7_622OQelcr-6-s6Uk7xcr9QkzidL0=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1uk7_622OQelcr-6-s6Uk7xcr9QkzidL0=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1uk7_622OQelcr-6-s6Uk7xcr9QkzidL0=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1uk7_622OQelcr-6-s6Uk7xcr9QkzidL0=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1uk7_622OQelcr-6-s6Uk7xcr9QkzidL0=s0","width":4024,"height":6036,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1uk7_622OQelcr-6-s6Uk7xcr9QkzidL0=s0","shareUrl":"1uk7_622OQelcr-6-s6Uk7xcr9QkzidL0","position":42,"positionTieBreaker":"MODEC-42.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-043',
  'col-modec-dia-das-criancas-2026',
  NULL,
  43,
  '{"id":"photo-modec-dia-das-criancas-2026-043","fileName":"MODEC-43.jpg","alt":"Fotografia 43 de MODEC DIA DAS CRIANÇAS 2026","width":5372,"height":3581,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1Y7Q8E1ZFWwLvjvellvQvHQVtUmM9pvRT=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Y7Q8E1ZFWwLvjvellvQvHQVtUmM9pvRT=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Y7Q8E1ZFWwLvjvellvQvHQVtUmM9pvRT=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Y7Q8E1ZFWwLvjvellvQvHQVtUmM9pvRT=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Y7Q8E1ZFWwLvjvellvQvHQVtUmM9pvRT=s0","width":5372,"height":3581,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1Y7Q8E1ZFWwLvjvellvQvHQVtUmM9pvRT=s0","shareUrl":"1Y7Q8E1ZFWwLvjvellvQvHQVtUmM9pvRT","position":43,"positionTieBreaker":"MODEC-43.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-044',
  'col-modec-dia-das-criancas-2026',
  NULL,
  44,
  '{"id":"photo-modec-dia-das-criancas-2026-044","fileName":"MODEC-44.jpg","alt":"Fotografia 44 de MODEC DIA DAS CRIANÇAS 2026","width":3828,"height":5742,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1G-pOjVZ2MC2Vwj-SY0HoMyVx8zPQo2JH=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1G-pOjVZ2MC2Vwj-SY0HoMyVx8zPQo2JH=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1G-pOjVZ2MC2Vwj-SY0HoMyVx8zPQo2JH=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1G-pOjVZ2MC2Vwj-SY0HoMyVx8zPQo2JH=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1G-pOjVZ2MC2Vwj-SY0HoMyVx8zPQo2JH=s0","width":3828,"height":5742,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1G-pOjVZ2MC2Vwj-SY0HoMyVx8zPQo2JH=s0","shareUrl":"1G-pOjVZ2MC2Vwj-SY0HoMyVx8zPQo2JH","position":44,"positionTieBreaker":"MODEC-44.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-045',
  'col-modec-dia-das-criancas-2026',
  NULL,
  45,
  '{"id":"photo-modec-dia-das-criancas-2026-045","fileName":"MODEC-45.jpg","alt":"Fotografia 45 de MODEC DIA DAS CRIANÇAS 2026","width":4024,"height":6036,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1uPp5SBHM_imXt7qETYTsTNKExvflpCSq=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1uPp5SBHM_imXt7qETYTsTNKExvflpCSq=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1uPp5SBHM_imXt7qETYTsTNKExvflpCSq=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1uPp5SBHM_imXt7qETYTsTNKExvflpCSq=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1uPp5SBHM_imXt7qETYTsTNKExvflpCSq=s0","width":4024,"height":6036,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1uPp5SBHM_imXt7qETYTsTNKExvflpCSq=s0","shareUrl":"1uPp5SBHM_imXt7qETYTsTNKExvflpCSq","position":45,"positionTieBreaker":"MODEC-45.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-046',
  'col-modec-dia-das-criancas-2026',
  NULL,
  46,
  '{"id":"photo-modec-dia-das-criancas-2026-046","fileName":"MODEC-46.jpg","alt":"Fotografia 46 de MODEC DIA DAS CRIANÇAS 2026","width":3701,"height":5551,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/11Y7P6yoLVZYxTQtmndVWgdmkNjNLkgPr=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/11Y7P6yoLVZYxTQtmndVWgdmkNjNLkgPr=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/11Y7P6yoLVZYxTQtmndVWgdmkNjNLkgPr=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/11Y7P6yoLVZYxTQtmndVWgdmkNjNLkgPr=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/11Y7P6yoLVZYxTQtmndVWgdmkNjNLkgPr=s0","width":3701,"height":5551,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/11Y7P6yoLVZYxTQtmndVWgdmkNjNLkgPr=s0","shareUrl":"11Y7P6yoLVZYxTQtmndVWgdmkNjNLkgPr","position":46,"positionTieBreaker":"MODEC-46.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-047',
  'col-modec-dia-das-criancas-2026',
  NULL,
  47,
  '{"id":"photo-modec-dia-das-criancas-2026-047","fileName":"MODEC-47.jpg","alt":"Fotografia 47 de MODEC DIA DAS CRIANÇAS 2026","width":6036,"height":4024,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/13Fqh9W1gWUdROwDN6_FfkOWRw-0QYVHb=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/13Fqh9W1gWUdROwDN6_FfkOWRw-0QYVHb=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/13Fqh9W1gWUdROwDN6_FfkOWRw-0QYVHb=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/13Fqh9W1gWUdROwDN6_FfkOWRw-0QYVHb=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/13Fqh9W1gWUdROwDN6_FfkOWRw-0QYVHb=s0","width":6036,"height":4024,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/13Fqh9W1gWUdROwDN6_FfkOWRw-0QYVHb=s0","shareUrl":"13Fqh9W1gWUdROwDN6_FfkOWRw-0QYVHb","position":47,"positionTieBreaker":"MODEC-47.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-048',
  'col-modec-dia-das-criancas-2026',
  NULL,
  48,
  '{"id":"photo-modec-dia-das-criancas-2026-048","fileName":"MODEC-48.jpg","alt":"Fotografia 48 de MODEC DIA DAS CRIANÇAS 2026","width":4024,"height":6036,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/17RqmZc6R33zqfzEZPr6iDGfbvJty-3TT=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/17RqmZc6R33zqfzEZPr6iDGfbvJty-3TT=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/17RqmZc6R33zqfzEZPr6iDGfbvJty-3TT=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/17RqmZc6R33zqfzEZPr6iDGfbvJty-3TT=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/17RqmZc6R33zqfzEZPr6iDGfbvJty-3TT=s0","width":4024,"height":6036,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/17RqmZc6R33zqfzEZPr6iDGfbvJty-3TT=s0","shareUrl":"17RqmZc6R33zqfzEZPr6iDGfbvJty-3TT","position":48,"positionTieBreaker":"MODEC-48.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-049',
  'col-modec-dia-das-criancas-2026',
  NULL,
  49,
  '{"id":"photo-modec-dia-das-criancas-2026-049","fileName":"MODEC-49.jpg","alt":"Fotografia 49 de MODEC DIA DAS CRIANÇAS 2026","width":6036,"height":4024,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1ZgKV1kDKwmTILbOr3Im80XOlcPxxRUxD=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZgKV1kDKwmTILbOr3Im80XOlcPxxRUxD=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZgKV1kDKwmTILbOr3Im80XOlcPxxRUxD=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZgKV1kDKwmTILbOr3Im80XOlcPxxRUxD=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZgKV1kDKwmTILbOr3Im80XOlcPxxRUxD=s0","width":6036,"height":4024,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1ZgKV1kDKwmTILbOr3Im80XOlcPxxRUxD=s0","shareUrl":"1ZgKV1kDKwmTILbOr3Im80XOlcPxxRUxD","position":49,"positionTieBreaker":"MODEC-49.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-050',
  'col-modec-dia-das-criancas-2026',
  NULL,
  50,
  '{"id":"photo-modec-dia-das-criancas-2026-050","fileName":"MODEC-50.jpg","alt":"Fotografia 50 de MODEC DIA DAS CRIANÇAS 2026","width":6036,"height":4024,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/10f7Yd-r7idywOm9FL5CNCuuRR9xkHW5z=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/10f7Yd-r7idywOm9FL5CNCuuRR9xkHW5z=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/10f7Yd-r7idywOm9FL5CNCuuRR9xkHW5z=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/10f7Yd-r7idywOm9FL5CNCuuRR9xkHW5z=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/10f7Yd-r7idywOm9FL5CNCuuRR9xkHW5z=s0","width":6036,"height":4024,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/10f7Yd-r7idywOm9FL5CNCuuRR9xkHW5z=s0","shareUrl":"10f7Yd-r7idywOm9FL5CNCuuRR9xkHW5z","position":50,"positionTieBreaker":"MODEC-50.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-051',
  'col-modec-dia-das-criancas-2026',
  NULL,
  51,
  '{"id":"photo-modec-dia-das-criancas-2026-051","fileName":"MODEC-51.jpg","alt":"Fotografia 51 de MODEC DIA DAS CRIANÇAS 2026","width":5158,"height":3439,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1lmpsKP3sle_hy42BrCXzSKRj_bPsfkxD=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1lmpsKP3sle_hy42BrCXzSKRj_bPsfkxD=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1lmpsKP3sle_hy42BrCXzSKRj_bPsfkxD=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1lmpsKP3sle_hy42BrCXzSKRj_bPsfkxD=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1lmpsKP3sle_hy42BrCXzSKRj_bPsfkxD=s0","width":5158,"height":3439,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1lmpsKP3sle_hy42BrCXzSKRj_bPsfkxD=s0","shareUrl":"1lmpsKP3sle_hy42BrCXzSKRj_bPsfkxD","position":51,"positionTieBreaker":"MODEC-51.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-052',
  'col-modec-dia-das-criancas-2026',
  NULL,
  52,
  '{"id":"photo-modec-dia-das-criancas-2026-052","fileName":"MODEC-52.jpg","alt":"Fotografia 52 de MODEC DIA DAS CRIANÇAS 2026","width":5642,"height":3761,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1pEq_JiHPX14j_bQ63lxf_sxozD02DTyC=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1pEq_JiHPX14j_bQ63lxf_sxozD02DTyC=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1pEq_JiHPX14j_bQ63lxf_sxozD02DTyC=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1pEq_JiHPX14j_bQ63lxf_sxozD02DTyC=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1pEq_JiHPX14j_bQ63lxf_sxozD02DTyC=s0","width":5642,"height":3761,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1pEq_JiHPX14j_bQ63lxf_sxozD02DTyC=s0","shareUrl":"1pEq_JiHPX14j_bQ63lxf_sxozD02DTyC","position":52,"positionTieBreaker":"MODEC-52.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-053',
  'col-modec-dia-das-criancas-2026',
  NULL,
  53,
  '{"id":"photo-modec-dia-das-criancas-2026-053","fileName":"MODEC-53.jpg","alt":"Fotografia 53 de MODEC DIA DAS CRIANÇAS 2026","width":2263,"height":3394,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/16Woix3Ds33JGVcreMZbTtVO8eSvwhtvI=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/16Woix3Ds33JGVcreMZbTtVO8eSvwhtvI=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/16Woix3Ds33JGVcreMZbTtVO8eSvwhtvI=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/16Woix3Ds33JGVcreMZbTtVO8eSvwhtvI=s0","width":2263,"height":3394,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/16Woix3Ds33JGVcreMZbTtVO8eSvwhtvI=s0","shareUrl":"16Woix3Ds33JGVcreMZbTtVO8eSvwhtvI","position":53,"positionTieBreaker":"MODEC-53.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-054',
  'col-modec-dia-das-criancas-2026',
  NULL,
  54,
  '{"id":"photo-modec-dia-das-criancas-2026-054","fileName":"MODEC-54.jpg","alt":"Fotografia 54 de MODEC DIA DAS CRIANÇAS 2026","width":4024,"height":6036,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/14Kfn6f-JG5gkSubWUVnKFM7Rxq50mw5D=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/14Kfn6f-JG5gkSubWUVnKFM7Rxq50mw5D=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/14Kfn6f-JG5gkSubWUVnKFM7Rxq50mw5D=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/14Kfn6f-JG5gkSubWUVnKFM7Rxq50mw5D=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/14Kfn6f-JG5gkSubWUVnKFM7Rxq50mw5D=s0","width":4024,"height":6036,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/14Kfn6f-JG5gkSubWUVnKFM7Rxq50mw5D=s0","shareUrl":"14Kfn6f-JG5gkSubWUVnKFM7Rxq50mw5D","position":54,"positionTieBreaker":"MODEC-54.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-055',
  'col-modec-dia-das-criancas-2026',
  NULL,
  55,
  '{"id":"photo-modec-dia-das-criancas-2026-055","fileName":"MODEC-55.jpg","alt":"Fotografia 55 de MODEC DIA DAS CRIANÇAS 2026","width":3662,"height":5493,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1BMtpIYwTxEUvUCn9MuuXQK4RPl1DWsQb=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1BMtpIYwTxEUvUCn9MuuXQK4RPl1DWsQb=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1BMtpIYwTxEUvUCn9MuuXQK4RPl1DWsQb=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1BMtpIYwTxEUvUCn9MuuXQK4RPl1DWsQb=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1BMtpIYwTxEUvUCn9MuuXQK4RPl1DWsQb=s0","width":3662,"height":5493,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1BMtpIYwTxEUvUCn9MuuXQK4RPl1DWsQb=s0","shareUrl":"1BMtpIYwTxEUvUCn9MuuXQK4RPl1DWsQb","position":55,"positionTieBreaker":"MODEC-55.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-056',
  'col-modec-dia-das-criancas-2026',
  NULL,
  56,
  '{"id":"photo-modec-dia-das-criancas-2026-056","fileName":"MODEC-56.jpg","alt":"Fotografia 56 de MODEC DIA DAS CRIANÇAS 2026","width":3639,"height":5459,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1dvx8bdMGQGAPDkCjK710agZbAkOElt5m=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1dvx8bdMGQGAPDkCjK710agZbAkOElt5m=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1dvx8bdMGQGAPDkCjK710agZbAkOElt5m=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1dvx8bdMGQGAPDkCjK710agZbAkOElt5m=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1dvx8bdMGQGAPDkCjK710agZbAkOElt5m=s0","width":3639,"height":5459,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1dvx8bdMGQGAPDkCjK710agZbAkOElt5m=s0","shareUrl":"1dvx8bdMGQGAPDkCjK710agZbAkOElt5m","position":56,"positionTieBreaker":"MODEC-56.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-057',
  'col-modec-dia-das-criancas-2026',
  NULL,
  57,
  '{"id":"photo-modec-dia-das-criancas-2026-057","fileName":"MODEC-57.jpg","alt":"Fotografia 57 de MODEC DIA DAS CRIANÇAS 2026","width":4024,"height":6036,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1P-PrHNeWGFH4mI90ZLfiSYWt85fZR3v5=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1P-PrHNeWGFH4mI90ZLfiSYWt85fZR3v5=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1P-PrHNeWGFH4mI90ZLfiSYWt85fZR3v5=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1P-PrHNeWGFH4mI90ZLfiSYWt85fZR3v5=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1P-PrHNeWGFH4mI90ZLfiSYWt85fZR3v5=s0","width":4024,"height":6036,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1P-PrHNeWGFH4mI90ZLfiSYWt85fZR3v5=s0","shareUrl":"1P-PrHNeWGFH4mI90ZLfiSYWt85fZR3v5","position":57,"positionTieBreaker":"MODEC-57.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-058',
  'col-modec-dia-das-criancas-2026',
  NULL,
  58,
  '{"id":"photo-modec-dia-das-criancas-2026-058","fileName":"MODEC-58.jpg","alt":"Fotografia 58 de MODEC DIA DAS CRIANÇAS 2026","width":6036,"height":4024,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1lhC1_UL3ens0szdoHmc5lU8keXLel6v8=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1lhC1_UL3ens0szdoHmc5lU8keXLel6v8=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1lhC1_UL3ens0szdoHmc5lU8keXLel6v8=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1lhC1_UL3ens0szdoHmc5lU8keXLel6v8=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1lhC1_UL3ens0szdoHmc5lU8keXLel6v8=s0","width":6036,"height":4024,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1lhC1_UL3ens0szdoHmc5lU8keXLel6v8=s0","shareUrl":"1lhC1_UL3ens0szdoHmc5lU8keXLel6v8","position":58,"positionTieBreaker":"MODEC-58.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-059',
  'col-modec-dia-das-criancas-2026',
  NULL,
  59,
  '{"id":"photo-modec-dia-das-criancas-2026-059","fileName":"MODEC-59.jpg","alt":"Fotografia 59 de MODEC DIA DAS CRIANÇAS 2026","width":6036,"height":4024,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/19efvDJL-blc8ReFxKIXzHHCVqzNKdi5L=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/19efvDJL-blc8ReFxKIXzHHCVqzNKdi5L=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/19efvDJL-blc8ReFxKIXzHHCVqzNKdi5L=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/19efvDJL-blc8ReFxKIXzHHCVqzNKdi5L=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/19efvDJL-blc8ReFxKIXzHHCVqzNKdi5L=s0","width":6036,"height":4024,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/19efvDJL-blc8ReFxKIXzHHCVqzNKdi5L=s0","shareUrl":"19efvDJL-blc8ReFxKIXzHHCVqzNKdi5L","position":59,"positionTieBreaker":"MODEC-59.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-060',
  'col-modec-dia-das-criancas-2026',
  NULL,
  60,
  '{"id":"photo-modec-dia-das-criancas-2026-060","fileName":"MODEC-60.jpg","alt":"Fotografia 60 de MODEC DIA DAS CRIANÇAS 2026","width":4024,"height":6036,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1k25pLp24wbEf4SfocZ5SeaLmmcPoVOWX=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1k25pLp24wbEf4SfocZ5SeaLmmcPoVOWX=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1k25pLp24wbEf4SfocZ5SeaLmmcPoVOWX=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1k25pLp24wbEf4SfocZ5SeaLmmcPoVOWX=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1k25pLp24wbEf4SfocZ5SeaLmmcPoVOWX=s0","width":4024,"height":6036,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1k25pLp24wbEf4SfocZ5SeaLmmcPoVOWX=s0","shareUrl":"1k25pLp24wbEf4SfocZ5SeaLmmcPoVOWX","position":60,"positionTieBreaker":"MODEC-60.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-061',
  'col-modec-dia-das-criancas-2026',
  NULL,
  61,
  '{"id":"photo-modec-dia-das-criancas-2026-061","fileName":"MODEC-61.jpg","alt":"Fotografia 61 de MODEC DIA DAS CRIANÇAS 2026","width":4881,"height":3254,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1yyEaUsabkP14_XG_5GdYZyetCwYFBw8C=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1yyEaUsabkP14_XG_5GdYZyetCwYFBw8C=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1yyEaUsabkP14_XG_5GdYZyetCwYFBw8C=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1yyEaUsabkP14_XG_5GdYZyetCwYFBw8C=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1yyEaUsabkP14_XG_5GdYZyetCwYFBw8C=s0","width":4881,"height":3254,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1yyEaUsabkP14_XG_5GdYZyetCwYFBw8C=s0","shareUrl":"1yyEaUsabkP14_XG_5GdYZyetCwYFBw8C","position":61,"positionTieBreaker":"MODEC-61.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-062',
  'col-modec-dia-das-criancas-2026',
  NULL,
  62,
  '{"id":"photo-modec-dia-das-criancas-2026-062","fileName":"MODEC-62.jpg","alt":"Fotografia 62 de MODEC DIA DAS CRIANÇAS 2026","width":2942,"height":4427,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/13G2zXrXkEEaBdvqubW9qtl-TXZ5YqHxs=w640","width":640,"height":963,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/13G2zXrXkEEaBdvqubW9qtl-TXZ5YqHxs=w1024","width":1024,"height":1541,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/13G2zXrXkEEaBdvqubW9qtl-TXZ5YqHxs=w2048","width":2048,"height":3082,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/13G2zXrXkEEaBdvqubW9qtl-TXZ5YqHxs=w3600","width":3600,"height":5417,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/13G2zXrXkEEaBdvqubW9qtl-TXZ5YqHxs=s0","width":2942,"height":4427,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/13G2zXrXkEEaBdvqubW9qtl-TXZ5YqHxs=s0","shareUrl":"13G2zXrXkEEaBdvqubW9qtl-TXZ5YqHxs","position":62,"positionTieBreaker":"MODEC-62.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-063',
  'col-modec-dia-das-criancas-2026',
  NULL,
  63,
  '{"id":"photo-modec-dia-das-criancas-2026-063","fileName":"MODEC-63.jpg","alt":"Fotografia 63 de MODEC DIA DAS CRIANÇAS 2026","width":4024,"height":6036,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1FBUxgSQ6uVHY2Ydvkb8UMigefGDCS1So=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1FBUxgSQ6uVHY2Ydvkb8UMigefGDCS1So=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1FBUxgSQ6uVHY2Ydvkb8UMigefGDCS1So=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1FBUxgSQ6uVHY2Ydvkb8UMigefGDCS1So=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1FBUxgSQ6uVHY2Ydvkb8UMigefGDCS1So=s0","width":4024,"height":6036,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1FBUxgSQ6uVHY2Ydvkb8UMigefGDCS1So=s0","shareUrl":"1FBUxgSQ6uVHY2Ydvkb8UMigefGDCS1So","position":63,"positionTieBreaker":"MODEC-63.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-064',
  'col-modec-dia-das-criancas-2026',
  NULL,
  64,
  '{"id":"photo-modec-dia-das-criancas-2026-064","fileName":"MODEC-64.jpg","alt":"Fotografia 64 de MODEC DIA DAS CRIANÇAS 2026","width":3649,"height":5473,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1GTaoVQ6BNFtx2ioPx4XXigRlqARLGad8=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1GTaoVQ6BNFtx2ioPx4XXigRlqARLGad8=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1GTaoVQ6BNFtx2ioPx4XXigRlqARLGad8=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1GTaoVQ6BNFtx2ioPx4XXigRlqARLGad8=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1GTaoVQ6BNFtx2ioPx4XXigRlqARLGad8=s0","width":3649,"height":5473,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1GTaoVQ6BNFtx2ioPx4XXigRlqARLGad8=s0","shareUrl":"1GTaoVQ6BNFtx2ioPx4XXigRlqARLGad8","position":64,"positionTieBreaker":"MODEC-64.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-065',
  'col-modec-dia-das-criancas-2026',
  NULL,
  65,
  '{"id":"photo-modec-dia-das-criancas-2026-065","fileName":"MODEC-65.jpg","alt":"Fotografia 65 de MODEC DIA DAS CRIANÇAS 2026","width":2475,"height":3713,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1J4iuC-EveXa9_kZ7iinzAndnxgtybXOx=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1J4iuC-EveXa9_kZ7iinzAndnxgtybXOx=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1J4iuC-EveXa9_kZ7iinzAndnxgtybXOx=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1J4iuC-EveXa9_kZ7iinzAndnxgtybXOx=s0","width":2475,"height":3713,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1J4iuC-EveXa9_kZ7iinzAndnxgtybXOx=s0","shareUrl":"1J4iuC-EveXa9_kZ7iinzAndnxgtybXOx","position":65,"positionTieBreaker":"MODEC-65.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-066',
  'col-modec-dia-das-criancas-2026',
  NULL,
  66,
  '{"id":"photo-modec-dia-das-criancas-2026-066","fileName":"MODEC-66.jpg","alt":"Fotografia 66 de MODEC DIA DAS CRIANÇAS 2026","width":3429,"height":2286,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/10UAF96tkH-PJrR_NLJhjy9NnPd3IDMPJ=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/10UAF96tkH-PJrR_NLJhjy9NnPd3IDMPJ=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/10UAF96tkH-PJrR_NLJhjy9NnPd3IDMPJ=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/10UAF96tkH-PJrR_NLJhjy9NnPd3IDMPJ=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/10UAF96tkH-PJrR_NLJhjy9NnPd3IDMPJ=s0","width":3429,"height":2286,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/10UAF96tkH-PJrR_NLJhjy9NnPd3IDMPJ=s0","shareUrl":"10UAF96tkH-PJrR_NLJhjy9NnPd3IDMPJ","position":66,"positionTieBreaker":"MODEC-66.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-067',
  'col-modec-dia-das-criancas-2026',
  NULL,
  67,
  '{"id":"photo-modec-dia-das-criancas-2026-067","fileName":"MODEC-67.jpg","alt":"Fotografia 67 de MODEC DIA DAS CRIANÇAS 2026","width":2624,"height":3936,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1ZSl1CHqfkL8OIILFKqXqixGeT5nTKXcC=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZSl1CHqfkL8OIILFKqXqixGeT5nTKXcC=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZSl1CHqfkL8OIILFKqXqixGeT5nTKXcC=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZSl1CHqfkL8OIILFKqXqixGeT5nTKXcC=s0","width":2624,"height":3936,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1ZSl1CHqfkL8OIILFKqXqixGeT5nTKXcC=s0","shareUrl":"1ZSl1CHqfkL8OIILFKqXqixGeT5nTKXcC","position":67,"positionTieBreaker":"MODEC-67.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-068',
  'col-modec-dia-das-criancas-2026',
  NULL,
  68,
  '{"id":"photo-modec-dia-das-criancas-2026-068","fileName":"MODEC-68.jpg","alt":"Fotografia 68 de MODEC DIA DAS CRIANÇAS 2026","width":3428,"height":2285,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1ROwPVnKaTpPkBxg8Ly3LhvPrHYD_PQZE=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ROwPVnKaTpPkBxg8Ly3LhvPrHYD_PQZE=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ROwPVnKaTpPkBxg8Ly3LhvPrHYD_PQZE=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ROwPVnKaTpPkBxg8Ly3LhvPrHYD_PQZE=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ROwPVnKaTpPkBxg8Ly3LhvPrHYD_PQZE=s0","width":3428,"height":2285,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1ROwPVnKaTpPkBxg8Ly3LhvPrHYD_PQZE=s0","shareUrl":"1ROwPVnKaTpPkBxg8Ly3LhvPrHYD_PQZE","position":68,"positionTieBreaker":"MODEC-68.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-069',
  'col-modec-dia-das-criancas-2026',
  NULL,
  69,
  '{"id":"photo-modec-dia-das-criancas-2026-069","fileName":"MODEC-69.jpg","alt":"Fotografia 69 de MODEC DIA DAS CRIANÇAS 2026","width":2429,"height":3643,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1PeciTga_az_RQARtLpUShERjorrvKjmU=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1PeciTga_az_RQARtLpUShERjorrvKjmU=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1PeciTga_az_RQARtLpUShERjorrvKjmU=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1PeciTga_az_RQARtLpUShERjorrvKjmU=s0","width":2429,"height":3643,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1PeciTga_az_RQARtLpUShERjorrvKjmU=s0","shareUrl":"1PeciTga_az_RQARtLpUShERjorrvKjmU","position":69,"positionTieBreaker":"MODEC-69.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-070',
  'col-modec-dia-das-criancas-2026',
  NULL,
  70,
  '{"id":"photo-modec-dia-das-criancas-2026-070","fileName":"MODEC-70.jpg","alt":"Fotografia 70 de MODEC DIA DAS CRIANÇAS 2026","width":3131,"height":4696,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1CUn20nBwnFmANj6CHhHAEfZhj7JsRND-=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1CUn20nBwnFmANj6CHhHAEfZhj7JsRND-=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1CUn20nBwnFmANj6CHhHAEfZhj7JsRND-=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1CUn20nBwnFmANj6CHhHAEfZhj7JsRND-=w3600","width":3600,"height":5399,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1CUn20nBwnFmANj6CHhHAEfZhj7JsRND-=s0","width":3131,"height":4696,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1CUn20nBwnFmANj6CHhHAEfZhj7JsRND-=s0","shareUrl":"1CUn20nBwnFmANj6CHhHAEfZhj7JsRND-","position":70,"positionTieBreaker":"MODEC-70.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-071',
  'col-modec-dia-das-criancas-2026',
  NULL,
  71,
  '{"id":"photo-modec-dia-das-criancas-2026-071","fileName":"MODEC-71.jpg","alt":"Fotografia 71 de MODEC DIA DAS CRIANÇAS 2026","width":3113,"height":4670,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1x-i3SraP7_Gjk__k7Vpd8hQ6tLTCyQX8=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1x-i3SraP7_Gjk__k7Vpd8hQ6tLTCyQX8=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1x-i3SraP7_Gjk__k7Vpd8hQ6tLTCyQX8=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1x-i3SraP7_Gjk__k7Vpd8hQ6tLTCyQX8=w3600","width":3600,"height":5401,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1x-i3SraP7_Gjk__k7Vpd8hQ6tLTCyQX8=s0","width":3113,"height":4670,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1x-i3SraP7_Gjk__k7Vpd8hQ6tLTCyQX8=s0","shareUrl":"1x-i3SraP7_Gjk__k7Vpd8hQ6tLTCyQX8","position":71,"positionTieBreaker":"MODEC-71.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-072',
  'col-modec-dia-das-criancas-2026',
  NULL,
  72,
  '{"id":"photo-modec-dia-das-criancas-2026-072","fileName":"MODEC-72.jpg","alt":"Fotografia 72 de MODEC DIA DAS CRIANÇAS 2026","width":3907,"height":5860,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1nrEjq2qIJEpkrjYYwLOjx9kCAc6E1UVJ=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1nrEjq2qIJEpkrjYYwLOjx9kCAc6E1UVJ=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1nrEjq2qIJEpkrjYYwLOjx9kCAc6E1UVJ=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1nrEjq2qIJEpkrjYYwLOjx9kCAc6E1UVJ=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1nrEjq2qIJEpkrjYYwLOjx9kCAc6E1UVJ=s0","width":3907,"height":5860,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1nrEjq2qIJEpkrjYYwLOjx9kCAc6E1UVJ=s0","shareUrl":"1nrEjq2qIJEpkrjYYwLOjx9kCAc6E1UVJ","position":72,"positionTieBreaker":"MODEC-72.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-073',
  'col-modec-dia-das-criancas-2026',
  NULL,
  73,
  '{"id":"photo-modec-dia-das-criancas-2026-073","fileName":"MODEC-73.jpg","alt":"Fotografia 73 de MODEC DIA DAS CRIANÇAS 2026","width":2185,"height":3278,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1akbRx1f4yMK-lTSgszxtz5qBkohxJgIK=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1akbRx1f4yMK-lTSgszxtz5qBkohxJgIK=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1akbRx1f4yMK-lTSgszxtz5qBkohxJgIK=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1akbRx1f4yMK-lTSgszxtz5qBkohxJgIK=s0","width":2185,"height":3278,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1akbRx1f4yMK-lTSgszxtz5qBkohxJgIK=s0","shareUrl":"1akbRx1f4yMK-lTSgszxtz5qBkohxJgIK","position":73,"positionTieBreaker":"MODEC-73.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-074',
  'col-modec-dia-das-criancas-2026',
  NULL,
  74,
  '{"id":"photo-modec-dia-das-criancas-2026-074","fileName":"MODEC-74.jpg","alt":"Fotografia 74 de MODEC DIA DAS CRIANÇAS 2026","width":2154,"height":3231,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1oqPUP2pNaL7dLTyfX9XjDOgMO6aTWKNr=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1oqPUP2pNaL7dLTyfX9XjDOgMO6aTWKNr=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1oqPUP2pNaL7dLTyfX9XjDOgMO6aTWKNr=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1oqPUP2pNaL7dLTyfX9XjDOgMO6aTWKNr=s0","width":2154,"height":3231,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1oqPUP2pNaL7dLTyfX9XjDOgMO6aTWKNr=s0","shareUrl":"1oqPUP2pNaL7dLTyfX9XjDOgMO6aTWKNr","position":74,"positionTieBreaker":"MODEC-74.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-075',
  'col-modec-dia-das-criancas-2026',
  NULL,
  75,
  '{"id":"photo-modec-dia-das-criancas-2026-075","fileName":"MODEC-75.jpg","alt":"Fotografia 75 de MODEC DIA DAS CRIANÇAS 2026","width":2172,"height":3258,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1iCh5Ee-ksRcq7V1QZ0xbt9uPRB98qQQL=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1iCh5Ee-ksRcq7V1QZ0xbt9uPRB98qQQL=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1iCh5Ee-ksRcq7V1QZ0xbt9uPRB98qQQL=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1iCh5Ee-ksRcq7V1QZ0xbt9uPRB98qQQL=s0","width":2172,"height":3258,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1iCh5Ee-ksRcq7V1QZ0xbt9uPRB98qQQL=s0","shareUrl":"1iCh5Ee-ksRcq7V1QZ0xbt9uPRB98qQQL","position":75,"positionTieBreaker":"MODEC-75.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-076',
  'col-modec-dia-das-criancas-2026',
  NULL,
  76,
  '{"id":"photo-modec-dia-das-criancas-2026-076","fileName":"MODEC-76.jpg","alt":"Fotografia 76 de MODEC DIA DAS CRIANÇAS 2026","width":2127,"height":3189,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1OpYz64Kci_BtsckY-n8o_bmiWWjQ-vTZ=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1OpYz64Kci_BtsckY-n8o_bmiWWjQ-vTZ=w1024","width":1024,"height":1535,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1OpYz64Kci_BtsckY-n8o_bmiWWjQ-vTZ=w2048","width":2048,"height":3071,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1OpYz64Kci_BtsckY-n8o_bmiWWjQ-vTZ=s0","width":2127,"height":3189,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1OpYz64Kci_BtsckY-n8o_bmiWWjQ-vTZ=s0","shareUrl":"1OpYz64Kci_BtsckY-n8o_bmiWWjQ-vTZ","position":76,"positionTieBreaker":"MODEC-76.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-077',
  'col-modec-dia-das-criancas-2026',
  NULL,
  77,
  '{"id":"photo-modec-dia-das-criancas-2026-077","fileName":"MODEC-77.jpg","alt":"Fotografia 77 de MODEC DIA DAS CRIANÇAS 2026","width":2295,"height":3443,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/18mdAkTlhcsQhoFovnMl531SOkO7n1qWf=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/18mdAkTlhcsQhoFovnMl531SOkO7n1qWf=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/18mdAkTlhcsQhoFovnMl531SOkO7n1qWf=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/18mdAkTlhcsQhoFovnMl531SOkO7n1qWf=s0","width":2295,"height":3443,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/18mdAkTlhcsQhoFovnMl531SOkO7n1qWf=s0","shareUrl":"18mdAkTlhcsQhoFovnMl531SOkO7n1qWf","position":77,"positionTieBreaker":"MODEC-77.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-078',
  'col-modec-dia-das-criancas-2026',
  NULL,
  78,
  '{"id":"photo-modec-dia-das-criancas-2026-078","fileName":"MODEC-78.jpg","alt":"Fotografia 78 de MODEC DIA DAS CRIANÇAS 2026","width":2174,"height":3260,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1TGsCqmyIavrewj91qPL5HQUMjX9MPnHW=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TGsCqmyIavrewj91qPL5HQUMjX9MPnHW=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TGsCqmyIavrewj91qPL5HQUMjX9MPnHW=w2048","width":2048,"height":3071,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TGsCqmyIavrewj91qPL5HQUMjX9MPnHW=s0","width":2174,"height":3260,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1TGsCqmyIavrewj91qPL5HQUMjX9MPnHW=s0","shareUrl":"1TGsCqmyIavrewj91qPL5HQUMjX9MPnHW","position":78,"positionTieBreaker":"MODEC-78.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-079',
  'col-modec-dia-das-criancas-2026',
  NULL,
  79,
  '{"id":"photo-modec-dia-das-criancas-2026-079","fileName":"MODEC-79.jpg","alt":"Fotografia 79 de MODEC DIA DAS CRIANÇAS 2026","width":1557,"height":2336,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1HsQo7HMZ3JTGFclzubpye-yrL9PMXEfC=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1HsQo7HMZ3JTGFclzubpye-yrL9PMXEfC=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1HsQo7HMZ3JTGFclzubpye-yrL9PMXEfC=s0","width":1557,"height":2336,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1HsQo7HMZ3JTGFclzubpye-yrL9PMXEfC=s0","shareUrl":"1HsQo7HMZ3JTGFclzubpye-yrL9PMXEfC","position":79,"positionTieBreaker":"MODEC-79.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-080',
  'col-modec-dia-das-criancas-2026',
  NULL,
  80,
  '{"id":"photo-modec-dia-das-criancas-2026-080","fileName":"MODEC-80.jpg","alt":"Fotografia 80 de MODEC DIA DAS CRIANÇAS 2026","width":3916,"height":5828,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1cuJ1jcOx72Gwr3eiaBtlmV7XCqAz-6D3=w640","width":640,"height":952,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1cuJ1jcOx72Gwr3eiaBtlmV7XCqAz-6D3=w1024","width":1024,"height":1524,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1cuJ1jcOx72Gwr3eiaBtlmV7XCqAz-6D3=w2048","width":2048,"height":3048,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1cuJ1jcOx72Gwr3eiaBtlmV7XCqAz-6D3=w3600","width":3600,"height":5358,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1cuJ1jcOx72Gwr3eiaBtlmV7XCqAz-6D3=s0","width":3916,"height":5828,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1cuJ1jcOx72Gwr3eiaBtlmV7XCqAz-6D3=s0","shareUrl":"1cuJ1jcOx72Gwr3eiaBtlmV7XCqAz-6D3","position":80,"positionTieBreaker":"MODEC-80.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-081',
  'col-modec-dia-das-criancas-2026',
  NULL,
  81,
  '{"id":"photo-modec-dia-das-criancas-2026-081","fileName":"MODEC-81.jpg","alt":"Fotografia 81 de MODEC DIA DAS CRIANÇAS 2026","width":3631,"height":5447,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1ILwcsepx0t2Uxh6qXcO2dZlYtLGI4QOW=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ILwcsepx0t2Uxh6qXcO2dZlYtLGI4QOW=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ILwcsepx0t2Uxh6qXcO2dZlYtLGI4QOW=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ILwcsepx0t2Uxh6qXcO2dZlYtLGI4QOW=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ILwcsepx0t2Uxh6qXcO2dZlYtLGI4QOW=s0","width":3631,"height":5447,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1ILwcsepx0t2Uxh6qXcO2dZlYtLGI4QOW=s0","shareUrl":"1ILwcsepx0t2Uxh6qXcO2dZlYtLGI4QOW","position":81,"positionTieBreaker":"MODEC-81.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-082',
  'col-modec-dia-das-criancas-2026',
  NULL,
  82,
  '{"id":"photo-modec-dia-das-criancas-2026-082","fileName":"MODEC-82.jpg","alt":"Fotografia 82 de MODEC DIA DAS CRIANÇAS 2026","width":3499,"height":5249,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1Htu7a4WeAjoMsRYEV0lAZUV6ru_aLFcI=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Htu7a4WeAjoMsRYEV0lAZUV6ru_aLFcI=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Htu7a4WeAjoMsRYEV0lAZUV6ru_aLFcI=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Htu7a4WeAjoMsRYEV0lAZUV6ru_aLFcI=w3600","width":3600,"height":5401,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Htu7a4WeAjoMsRYEV0lAZUV6ru_aLFcI=s0","width":3499,"height":5249,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1Htu7a4WeAjoMsRYEV0lAZUV6ru_aLFcI=s0","shareUrl":"1Htu7a4WeAjoMsRYEV0lAZUV6ru_aLFcI","position":82,"positionTieBreaker":"MODEC-82.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-083',
  'col-modec-dia-das-criancas-2026',
  NULL,
  83,
  '{"id":"photo-modec-dia-das-criancas-2026-083","fileName":"MODEC-83.jpg","alt":"Fotografia 83 de MODEC DIA DAS CRIANÇAS 2026","width":2313,"height":3470,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1Kl5jgPUqX77pSOnkgWmOTGPkKY5ED_bQ=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Kl5jgPUqX77pSOnkgWmOTGPkKY5ED_bQ=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Kl5jgPUqX77pSOnkgWmOTGPkKY5ED_bQ=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Kl5jgPUqX77pSOnkgWmOTGPkKY5ED_bQ=s0","width":2313,"height":3470,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1Kl5jgPUqX77pSOnkgWmOTGPkKY5ED_bQ=s0","shareUrl":"1Kl5jgPUqX77pSOnkgWmOTGPkKY5ED_bQ","position":83,"positionTieBreaker":"MODEC-83.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-084',
  'col-modec-dia-das-criancas-2026',
  NULL,
  84,
  '{"id":"photo-modec-dia-das-criancas-2026-084","fileName":"MODEC-84.jpg","alt":"Fotografia 84 de MODEC DIA DAS CRIANÇAS 2026","width":2273,"height":3410,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1GSmXCNl9F-0pFu37Z-sodiFhWurYtRul=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1GSmXCNl9F-0pFu37Z-sodiFhWurYtRul=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1GSmXCNl9F-0pFu37Z-sodiFhWurYtRul=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1GSmXCNl9F-0pFu37Z-sodiFhWurYtRul=s0","width":2273,"height":3410,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1GSmXCNl9F-0pFu37Z-sodiFhWurYtRul=s0","shareUrl":"1GSmXCNl9F-0pFu37Z-sodiFhWurYtRul","position":84,"positionTieBreaker":"MODEC-84.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-085',
  'col-modec-dia-das-criancas-2026',
  NULL,
  85,
  '{"id":"photo-modec-dia-das-criancas-2026-085","fileName":"MODEC-85.jpg","alt":"Fotografia 85 de MODEC DIA DAS CRIANÇAS 2026","width":2439,"height":3659,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1nCkprliJMLZwHug3upgwgS9tzwahS_N7=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1nCkprliJMLZwHug3upgwgS9tzwahS_N7=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1nCkprliJMLZwHug3upgwgS9tzwahS_N7=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1nCkprliJMLZwHug3upgwgS9tzwahS_N7=s0","width":2439,"height":3659,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1nCkprliJMLZwHug3upgwgS9tzwahS_N7=s0","shareUrl":"1nCkprliJMLZwHug3upgwgS9tzwahS_N7","position":85,"positionTieBreaker":"MODEC-85.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-086',
  'col-modec-dia-das-criancas-2026',
  NULL,
  86,
  '{"id":"photo-modec-dia-das-criancas-2026-086","fileName":"MODEC-86.jpg","alt":"Fotografia 86 de MODEC DIA DAS CRIANÇAS 2026","width":3082,"height":2055,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1eZ92UyzbvuEYW-19CDCphHNem8YG5Xq2=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1eZ92UyzbvuEYW-19CDCphHNem8YG5Xq2=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1eZ92UyzbvuEYW-19CDCphHNem8YG5Xq2=w2048","width":2048,"height":1366,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1eZ92UyzbvuEYW-19CDCphHNem8YG5Xq2=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1eZ92UyzbvuEYW-19CDCphHNem8YG5Xq2=s0","width":3082,"height":2055,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1eZ92UyzbvuEYW-19CDCphHNem8YG5Xq2=s0","shareUrl":"1eZ92UyzbvuEYW-19CDCphHNem8YG5Xq2","position":86,"positionTieBreaker":"MODEC-86.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-087',
  'col-modec-dia-das-criancas-2026',
  NULL,
  87,
  '{"id":"photo-modec-dia-das-criancas-2026-087","fileName":"MODEC-87.jpg","alt":"Fotografia 87 de MODEC DIA DAS CRIANÇAS 2026","width":2196,"height":3296,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1sEk3IcGRvpZjlGyE7O-XRjFDkHVTq7T4=w640","width":640,"height":961,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1sEk3IcGRvpZjlGyE7O-XRjFDkHVTq7T4=w1024","width":1024,"height":1537,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1sEk3IcGRvpZjlGyE7O-XRjFDkHVTq7T4=w2048","width":2048,"height":3074,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1sEk3IcGRvpZjlGyE7O-XRjFDkHVTq7T4=s0","width":2196,"height":3296,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1sEk3IcGRvpZjlGyE7O-XRjFDkHVTq7T4=s0","shareUrl":"1sEk3IcGRvpZjlGyE7O-XRjFDkHVTq7T4","position":87,"positionTieBreaker":"MODEC-87.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-088',
  'col-modec-dia-das-criancas-2026',
  NULL,
  88,
  '{"id":"photo-modec-dia-das-criancas-2026-088","fileName":"MODEC-88.jpg","alt":"Fotografia 88 de MODEC DIA DAS CRIANÇAS 2026","width":3936,"height":2624,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1aANwBuBGkK_HK-l9wfQL1fIE90LEg-Fa=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1aANwBuBGkK_HK-l9wfQL1fIE90LEg-Fa=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1aANwBuBGkK_HK-l9wfQL1fIE90LEg-Fa=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1aANwBuBGkK_HK-l9wfQL1fIE90LEg-Fa=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1aANwBuBGkK_HK-l9wfQL1fIE90LEg-Fa=s0","width":3936,"height":2624,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1aANwBuBGkK_HK-l9wfQL1fIE90LEg-Fa=s0","shareUrl":"1aANwBuBGkK_HK-l9wfQL1fIE90LEg-Fa","position":88,"positionTieBreaker":"MODEC-88.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-089',
  'col-modec-dia-das-criancas-2026',
  NULL,
  89,
  '{"id":"photo-modec-dia-das-criancas-2026-089","fileName":"MODEC-89.jpg","alt":"Fotografia 89 de MODEC DIA DAS CRIANÇAS 2026","width":3403,"height":2269,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1XL8JyW7VYNwVRM47sDLRADanlqOeJOri=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1XL8JyW7VYNwVRM47sDLRADanlqOeJOri=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1XL8JyW7VYNwVRM47sDLRADanlqOeJOri=w2048","width":2048,"height":1366,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1XL8JyW7VYNwVRM47sDLRADanlqOeJOri=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1XL8JyW7VYNwVRM47sDLRADanlqOeJOri=s0","width":3403,"height":2269,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1XL8JyW7VYNwVRM47sDLRADanlqOeJOri=s0","shareUrl":"1XL8JyW7VYNwVRM47sDLRADanlqOeJOri","position":89,"positionTieBreaker":"MODEC-89.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-090',
  'col-modec-dia-das-criancas-2026',
  NULL,
  90,
  '{"id":"photo-modec-dia-das-criancas-2026-090","fileName":"MODEC-90.jpg","alt":"Fotografia 90 de MODEC DIA DAS CRIANÇAS 2026","width":5839,"height":3893,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1aE3Uj_XBTx4MklANC88YWCNbfR_IaNqK=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1aE3Uj_XBTx4MklANC88YWCNbfR_IaNqK=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1aE3Uj_XBTx4MklANC88YWCNbfR_IaNqK=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1aE3Uj_XBTx4MklANC88YWCNbfR_IaNqK=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1aE3Uj_XBTx4MklANC88YWCNbfR_IaNqK=s0","width":5839,"height":3893,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1aE3Uj_XBTx4MklANC88YWCNbfR_IaNqK=s0","shareUrl":"1aE3Uj_XBTx4MklANC88YWCNbfR_IaNqK","position":90,"positionTieBreaker":"MODEC-90.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-091',
  'col-modec-dia-das-criancas-2026',
  NULL,
  91,
  '{"id":"photo-modec-dia-das-criancas-2026-091","fileName":"MODEC-91.jpg","alt":"Fotografia 91 de MODEC DIA DAS CRIANÇAS 2026","width":2384,"height":3576,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1wrwPrHQeQfierpUPOBAN92uRt3IsxW8w=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1wrwPrHQeQfierpUPOBAN92uRt3IsxW8w=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1wrwPrHQeQfierpUPOBAN92uRt3IsxW8w=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1wrwPrHQeQfierpUPOBAN92uRt3IsxW8w=s0","width":2384,"height":3576,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1wrwPrHQeQfierpUPOBAN92uRt3IsxW8w=s0","shareUrl":"1wrwPrHQeQfierpUPOBAN92uRt3IsxW8w","position":91,"positionTieBreaker":"MODEC-91.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-092',
  'col-modec-dia-das-criancas-2026',
  NULL,
  92,
  '{"id":"photo-modec-dia-das-criancas-2026-092","fileName":"MODEC-92.jpg","alt":"Fotografia 92 de MODEC DIA DAS CRIANÇAS 2026","width":2042,"height":3064,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1kD3dtu-hF_EgS-onb-l_pvVvJBGQTFQy=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1kD3dtu-hF_EgS-onb-l_pvVvJBGQTFQy=w1024","width":1024,"height":1537,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1kD3dtu-hF_EgS-onb-l_pvVvJBGQTFQy=w2048","width":2048,"height":3073,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1kD3dtu-hF_EgS-onb-l_pvVvJBGQTFQy=s0","width":2042,"height":3064,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1kD3dtu-hF_EgS-onb-l_pvVvJBGQTFQy=s0","shareUrl":"1kD3dtu-hF_EgS-onb-l_pvVvJBGQTFQy","position":92,"positionTieBreaker":"MODEC-92.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-093',
  'col-modec-dia-das-criancas-2026',
  NULL,
  93,
  '{"id":"photo-modec-dia-das-criancas-2026-093","fileName":"MODEC-93.jpg","alt":"Fotografia 93 de MODEC DIA DAS CRIANÇAS 2026","width":2489,"height":3733,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1z_bF0_6SrRQrIQLNXOhA3mBVH43OavTa=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1z_bF0_6SrRQrIQLNXOhA3mBVH43OavTa=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1z_bF0_6SrRQrIQLNXOhA3mBVH43OavTa=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1z_bF0_6SrRQrIQLNXOhA3mBVH43OavTa=s0","width":2489,"height":3733,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1z_bF0_6SrRQrIQLNXOhA3mBVH43OavTa=s0","shareUrl":"1z_bF0_6SrRQrIQLNXOhA3mBVH43OavTa","position":93,"positionTieBreaker":"MODEC-93.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-094',
  'col-modec-dia-das-criancas-2026',
  NULL,
  94,
  '{"id":"photo-modec-dia-das-criancas-2026-094","fileName":"MODEC-94.jpg","alt":"Fotografia 94 de MODEC DIA DAS CRIANÇAS 2026","width":2579,"height":3869,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1cnd3vbD3SFmsd0d4wKUV4aYpij746nOB=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1cnd3vbD3SFmsd0d4wKUV4aYpij746nOB=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1cnd3vbD3SFmsd0d4wKUV4aYpij746nOB=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1cnd3vbD3SFmsd0d4wKUV4aYpij746nOB=s0","width":2579,"height":3869,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1cnd3vbD3SFmsd0d4wKUV4aYpij746nOB=s0","shareUrl":"1cnd3vbD3SFmsd0d4wKUV4aYpij746nOB","position":94,"positionTieBreaker":"MODEC-94.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-095',
  'col-modec-dia-das-criancas-2026',
  NULL,
  95,
  '{"id":"photo-modec-dia-das-criancas-2026-095","fileName":"MODEC-95.jpg","alt":"Fotografia 95 de MODEC DIA DAS CRIANÇAS 2026","width":2227,"height":3339,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1O_39Q0kQUg64-NMnpnU2Eh5jWp-lEFQr=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1O_39Q0kQUg64-NMnpnU2Eh5jWp-lEFQr=w1024","width":1024,"height":1535,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1O_39Q0kQUg64-NMnpnU2Eh5jWp-lEFQr=w2048","width":2048,"height":3071,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1O_39Q0kQUg64-NMnpnU2Eh5jWp-lEFQr=s0","width":2227,"height":3339,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1O_39Q0kQUg64-NMnpnU2Eh5jWp-lEFQr=s0","shareUrl":"1O_39Q0kQUg64-NMnpnU2Eh5jWp-lEFQr","position":95,"positionTieBreaker":"MODEC-95.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-096',
  'col-modec-dia-das-criancas-2026',
  NULL,
  96,
  '{"id":"photo-modec-dia-das-criancas-2026-096","fileName":"MODEC-96.jpg","alt":"Fotografia 96 de MODEC DIA DAS CRIANÇAS 2026","width":2624,"height":3936,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1qfP3vv9IPChjCSgmICNqGL706izH1Qca=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1qfP3vv9IPChjCSgmICNqGL706izH1Qca=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1qfP3vv9IPChjCSgmICNqGL706izH1Qca=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1qfP3vv9IPChjCSgmICNqGL706izH1Qca=s0","width":2624,"height":3936,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1qfP3vv9IPChjCSgmICNqGL706izH1Qca=s0","shareUrl":"1qfP3vv9IPChjCSgmICNqGL706izH1Qca","position":96,"positionTieBreaker":"MODEC-96.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-097',
  'col-modec-dia-das-criancas-2026',
  NULL,
  97,
  '{"id":"photo-modec-dia-das-criancas-2026-097","fileName":"MODEC-97.jpg","alt":"Fotografia 97 de MODEC DIA DAS CRIANÇAS 2026","width":2624,"height":3936,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1_2Gtwf2MebtJbDXxL3HPUqDm1896k6ui=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_2Gtwf2MebtJbDXxL3HPUqDm1896k6ui=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_2Gtwf2MebtJbDXxL3HPUqDm1896k6ui=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_2Gtwf2MebtJbDXxL3HPUqDm1896k6ui=s0","width":2624,"height":3936,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1_2Gtwf2MebtJbDXxL3HPUqDm1896k6ui=s0","shareUrl":"1_2Gtwf2MebtJbDXxL3HPUqDm1896k6ui","position":97,"positionTieBreaker":"MODEC-97.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-098',
  'col-modec-dia-das-criancas-2026',
  NULL,
  98,
  '{"id":"photo-modec-dia-das-criancas-2026-098","fileName":"MODEC-98.jpg","alt":"Fotografia 98 de MODEC DIA DAS CRIANÇAS 2026","width":2624,"height":3936,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1_gSYTbEuQeTvmMgFXvjIezZDQLo1_cBE=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_gSYTbEuQeTvmMgFXvjIezZDQLo1_cBE=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_gSYTbEuQeTvmMgFXvjIezZDQLo1_cBE=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_gSYTbEuQeTvmMgFXvjIezZDQLo1_cBE=s0","width":2624,"height":3936,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1_gSYTbEuQeTvmMgFXvjIezZDQLo1_cBE=s0","shareUrl":"1_gSYTbEuQeTvmMgFXvjIezZDQLo1_cBE","position":98,"positionTieBreaker":"MODEC-98.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-099',
  'col-modec-dia-das-criancas-2026',
  NULL,
  99,
  '{"id":"photo-modec-dia-das-criancas-2026-099","fileName":"MODEC-99.jpg","alt":"Fotografia 99 de MODEC DIA DAS CRIANÇAS 2026","width":2624,"height":3936,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1q_DJSHri5mdJp5sookLqlVXjicTiYPfx=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1q_DJSHri5mdJp5sookLqlVXjicTiYPfx=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1q_DJSHri5mdJp5sookLqlVXjicTiYPfx=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1q_DJSHri5mdJp5sookLqlVXjicTiYPfx=s0","width":2624,"height":3936,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1q_DJSHri5mdJp5sookLqlVXjicTiYPfx=s0","shareUrl":"1q_DJSHri5mdJp5sookLqlVXjicTiYPfx","position":99,"positionTieBreaker":"MODEC-99.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-100',
  'col-modec-dia-das-criancas-2026',
  NULL,
  100,
  '{"id":"photo-modec-dia-das-criancas-2026-100","fileName":"MODEC-100.jpg","alt":"Fotografia 100 de MODEC DIA DAS CRIANÇAS 2026","width":2624,"height":3936,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1zrg18fqibXyjVMaJh-JcbgUHIMIhoD7E=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1zrg18fqibXyjVMaJh-JcbgUHIMIhoD7E=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1zrg18fqibXyjVMaJh-JcbgUHIMIhoD7E=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1zrg18fqibXyjVMaJh-JcbgUHIMIhoD7E=s0","width":2624,"height":3936,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1zrg18fqibXyjVMaJh-JcbgUHIMIhoD7E=s0","shareUrl":"1zrg18fqibXyjVMaJh-JcbgUHIMIhoD7E","position":100,"positionTieBreaker":"MODEC-100.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-101',
  'col-modec-dia-das-criancas-2026',
  NULL,
  101,
  '{"id":"photo-modec-dia-das-criancas-2026-101","fileName":"MODEC-101.jpg","alt":"Fotografia 101 de MODEC DIA DAS CRIANÇAS 2026","width":2517,"height":3775,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1H-jXcu0XW9hbOfyte2lSmjPYY6SRyBQu=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1H-jXcu0XW9hbOfyte2lSmjPYY6SRyBQu=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1H-jXcu0XW9hbOfyte2lSmjPYY6SRyBQu=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1H-jXcu0XW9hbOfyte2lSmjPYY6SRyBQu=s0","width":2517,"height":3775,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1H-jXcu0XW9hbOfyte2lSmjPYY6SRyBQu=s0","shareUrl":"1H-jXcu0XW9hbOfyte2lSmjPYY6SRyBQu","position":101,"positionTieBreaker":"MODEC-101.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-102',
  'col-modec-dia-das-criancas-2026',
  NULL,
  102,
  '{"id":"photo-modec-dia-das-criancas-2026-102","fileName":"MODEC-102.jpg","alt":"Fotografia 102 de MODEC DIA DAS CRIANÇAS 2026","width":3523,"height":5285,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1jy0lPGEy9tKMB9YZH7yusMlNF8iMukkE=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1jy0lPGEy9tKMB9YZH7yusMlNF8iMukkE=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1jy0lPGEy9tKMB9YZH7yusMlNF8iMukkE=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1jy0lPGEy9tKMB9YZH7yusMlNF8iMukkE=w3600","width":3600,"height":5401,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1jy0lPGEy9tKMB9YZH7yusMlNF8iMukkE=s0","width":3523,"height":5285,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1jy0lPGEy9tKMB9YZH7yusMlNF8iMukkE=s0","shareUrl":"1jy0lPGEy9tKMB9YZH7yusMlNF8iMukkE","position":102,"positionTieBreaker":"MODEC-102.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-103',
  'col-modec-dia-das-criancas-2026',
  NULL,
  103,
  '{"id":"photo-modec-dia-das-criancas-2026-103","fileName":"MODEC-103.jpg","alt":"Fotografia 103 de MODEC DIA DAS CRIANÇAS 2026","width":3545,"height":5316,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/13ec-VaDpOS9V7jKGITk8QNzKhRdALdt0=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/13ec-VaDpOS9V7jKGITk8QNzKhRdALdt0=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/13ec-VaDpOS9V7jKGITk8QNzKhRdALdt0=w2048","width":2048,"height":3071,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/13ec-VaDpOS9V7jKGITk8QNzKhRdALdt0=w3600","width":3600,"height":5398,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/13ec-VaDpOS9V7jKGITk8QNzKhRdALdt0=s0","width":3545,"height":5316,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/13ec-VaDpOS9V7jKGITk8QNzKhRdALdt0=s0","shareUrl":"13ec-VaDpOS9V7jKGITk8QNzKhRdALdt0","position":103,"positionTieBreaker":"MODEC-103.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-104',
  'col-modec-dia-das-criancas-2026',
  NULL,
  104,
  '{"id":"photo-modec-dia-das-criancas-2026-104","fileName":"MODEC-104.jpg","alt":"Fotografia 104 de MODEC DIA DAS CRIANÇAS 2026","width":3446,"height":5168,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/19k29_VyExT0Thhyk9H-TN2JV0eBL6mf6=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/19k29_VyExT0Thhyk9H-TN2JV0eBL6mf6=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/19k29_VyExT0Thhyk9H-TN2JV0eBL6mf6=w2048","width":2048,"height":3071,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/19k29_VyExT0Thhyk9H-TN2JV0eBL6mf6=w3600","width":3600,"height":5399,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/19k29_VyExT0Thhyk9H-TN2JV0eBL6mf6=s0","width":3446,"height":5168,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/19k29_VyExT0Thhyk9H-TN2JV0eBL6mf6=s0","shareUrl":"19k29_VyExT0Thhyk9H-TN2JV0eBL6mf6","position":104,"positionTieBreaker":"MODEC-104.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-105',
  'col-modec-dia-das-criancas-2026',
  NULL,
  105,
  '{"id":"photo-modec-dia-das-criancas-2026-105","fileName":"MODEC-105.jpg","alt":"Fotografia 105 de MODEC DIA DAS CRIANÇAS 2026","width":3921,"height":5881,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1YaYBhzVEfKsN0-P2EJvaJRQJ9_sWjzRS=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1YaYBhzVEfKsN0-P2EJvaJRQJ9_sWjzRS=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1YaYBhzVEfKsN0-P2EJvaJRQJ9_sWjzRS=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1YaYBhzVEfKsN0-P2EJvaJRQJ9_sWjzRS=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1YaYBhzVEfKsN0-P2EJvaJRQJ9_sWjzRS=s0","width":3921,"height":5881,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1YaYBhzVEfKsN0-P2EJvaJRQJ9_sWjzRS=s0","shareUrl":"1YaYBhzVEfKsN0-P2EJvaJRQJ9_sWjzRS","position":105,"positionTieBreaker":"MODEC-105.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-106',
  'col-modec-dia-das-criancas-2026',
  NULL,
  106,
  '{"id":"photo-modec-dia-das-criancas-2026-106","fileName":"MODEC-106.jpg","alt":"Fotografia 106 de MODEC DIA DAS CRIANÇAS 2026","width":3665,"height":5498,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1RxK4irgUOP4xqa9c7RIL_0xmyBLnTWEW=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1RxK4irgUOP4xqa9c7RIL_0xmyBLnTWEW=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1RxK4irgUOP4xqa9c7RIL_0xmyBLnTWEW=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1RxK4irgUOP4xqa9c7RIL_0xmyBLnTWEW=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1RxK4irgUOP4xqa9c7RIL_0xmyBLnTWEW=s0","width":3665,"height":5498,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1RxK4irgUOP4xqa9c7RIL_0xmyBLnTWEW=s0","shareUrl":"1RxK4irgUOP4xqa9c7RIL_0xmyBLnTWEW","position":106,"positionTieBreaker":"MODEC-106.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-107',
  'col-modec-dia-das-criancas-2026',
  NULL,
  107,
  '{"id":"photo-modec-dia-das-criancas-2026-107","fileName":"MODEC-107.jpg","alt":"Fotografia 107 de MODEC DIA DAS CRIANÇAS 2026","width":3345,"height":5016,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1FgElVToA2prYNdjR8RmWHYudID5Pbdo5=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1FgElVToA2prYNdjR8RmWHYudID5Pbdo5=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1FgElVToA2prYNdjR8RmWHYudID5Pbdo5=w2048","width":2048,"height":3071,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1FgElVToA2prYNdjR8RmWHYudID5Pbdo5=w3600","width":3600,"height":5398,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1FgElVToA2prYNdjR8RmWHYudID5Pbdo5=s0","width":3345,"height":5016,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1FgElVToA2prYNdjR8RmWHYudID5Pbdo5=s0","shareUrl":"1FgElVToA2prYNdjR8RmWHYudID5Pbdo5","position":107,"positionTieBreaker":"MODEC-107.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-108',
  'col-modec-dia-das-criancas-2026',
  NULL,
  108,
  '{"id":"photo-modec-dia-das-criancas-2026-108","fileName":"MODEC-108.jpg","alt":"Fotografia 108 de MODEC DIA DAS CRIANÇAS 2026","width":3558,"height":5337,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1_RCEpYa6Q7bfTR24Z4lLl_y0XLbvc0ih=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_RCEpYa6Q7bfTR24Z4lLl_y0XLbvc0ih=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_RCEpYa6Q7bfTR24Z4lLl_y0XLbvc0ih=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_RCEpYa6Q7bfTR24Z4lLl_y0XLbvc0ih=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_RCEpYa6Q7bfTR24Z4lLl_y0XLbvc0ih=s0","width":3558,"height":5337,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1_RCEpYa6Q7bfTR24Z4lLl_y0XLbvc0ih=s0","shareUrl":"1_RCEpYa6Q7bfTR24Z4lLl_y0XLbvc0ih","position":108,"positionTieBreaker":"MODEC-108.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-109',
  'col-modec-dia-das-criancas-2026',
  NULL,
  109,
  '{"id":"photo-modec-dia-das-criancas-2026-109","fileName":"MODEC-109.jpg","alt":"Fotografia 109 de MODEC DIA DAS CRIANÇAS 2026","width":3650,"height":5475,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1TpDFAuk8mucsgBuXQjKM9WY6QHP2xkI3=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TpDFAuk8mucsgBuXQjKM9WY6QHP2xkI3=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TpDFAuk8mucsgBuXQjKM9WY6QHP2xkI3=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TpDFAuk8mucsgBuXQjKM9WY6QHP2xkI3=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1TpDFAuk8mucsgBuXQjKM9WY6QHP2xkI3=s0","width":3650,"height":5475,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1TpDFAuk8mucsgBuXQjKM9WY6QHP2xkI3=s0","shareUrl":"1TpDFAuk8mucsgBuXQjKM9WY6QHP2xkI3","position":109,"positionTieBreaker":"MODEC-109.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-110',
  'col-modec-dia-das-criancas-2026',
  NULL,
  110,
  '{"id":"photo-modec-dia-das-criancas-2026-110","fileName":"MODEC-110.jpg","alt":"Fotografia 110 de MODEC DIA DAS CRIANÇAS 2026","width":3164,"height":4745,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1wejcJnLWNRya98E8NA4kcfxUvf8hZOxO=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1wejcJnLWNRya98E8NA4kcfxUvf8hZOxO=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1wejcJnLWNRya98E8NA4kcfxUvf8hZOxO=w2048","width":2048,"height":3071,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1wejcJnLWNRya98E8NA4kcfxUvf8hZOxO=w3600","width":3600,"height":5399,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1wejcJnLWNRya98E8NA4kcfxUvf8hZOxO=s0","width":3164,"height":4745,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1wejcJnLWNRya98E8NA4kcfxUvf8hZOxO=s0","shareUrl":"1wejcJnLWNRya98E8NA4kcfxUvf8hZOxO","position":110,"positionTieBreaker":"MODEC-110.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-111',
  'col-modec-dia-das-criancas-2026',
  NULL,
  111,
  '{"id":"photo-modec-dia-das-criancas-2026-111","fileName":"MODEC-111.jpg","alt":"Fotografia 111 de MODEC DIA DAS CRIANÇAS 2026","width":3718,"height":5578,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1ZARQR3tgrDnwBa8186gaNxz2iPzvyBd7=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZARQR3tgrDnwBa8186gaNxz2iPzvyBd7=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZARQR3tgrDnwBa8186gaNxz2iPzvyBd7=w2048","width":2048,"height":3073,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZARQR3tgrDnwBa8186gaNxz2iPzvyBd7=w3600","width":3600,"height":5401,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZARQR3tgrDnwBa8186gaNxz2iPzvyBd7=s0","width":3718,"height":5578,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1ZARQR3tgrDnwBa8186gaNxz2iPzvyBd7=s0","shareUrl":"1ZARQR3tgrDnwBa8186gaNxz2iPzvyBd7","position":111,"positionTieBreaker":"MODEC-111.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-112',
  'col-modec-dia-das-criancas-2026',
  NULL,
  112,
  '{"id":"photo-modec-dia-das-criancas-2026-112","fileName":"MODEC-112.jpg","alt":"Fotografia 112 de MODEC DIA DAS CRIANÇAS 2026","width":4927,"height":3285,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1_TedbShycGrClgRNs18978_DOEZc5UY5=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_TedbShycGrClgRNs18978_DOEZc5UY5=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_TedbShycGrClgRNs18978_DOEZc5UY5=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_TedbShycGrClgRNs18978_DOEZc5UY5=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1_TedbShycGrClgRNs18978_DOEZc5UY5=s0","width":4927,"height":3285,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1_TedbShycGrClgRNs18978_DOEZc5UY5=s0","shareUrl":"1_TedbShycGrClgRNs18978_DOEZc5UY5","position":112,"positionTieBreaker":"MODEC-112.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-113',
  'col-modec-dia-das-criancas-2026',
  NULL,
  113,
  '{"id":"photo-modec-dia-das-criancas-2026-113","fileName":"MODEC-113.jpg","alt":"Fotografia 113 de MODEC DIA DAS CRIANÇAS 2026","width":2973,"height":4456,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1ErF0TDsUpdnvCX6OBbCM-8b44_G7jS7c=w640","width":640,"height":959,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ErF0TDsUpdnvCX6OBbCM-8b44_G7jS7c=w1024","width":1024,"height":1535,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ErF0TDsUpdnvCX6OBbCM-8b44_G7jS7c=w2048","width":2048,"height":3070,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ErF0TDsUpdnvCX6OBbCM-8b44_G7jS7c=w3600","width":3600,"height":5396,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ErF0TDsUpdnvCX6OBbCM-8b44_G7jS7c=s0","width":2973,"height":4456,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1ErF0TDsUpdnvCX6OBbCM-8b44_G7jS7c=s0","shareUrl":"1ErF0TDsUpdnvCX6OBbCM-8b44_G7jS7c","position":113,"positionTieBreaker":"MODEC-113.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-114',
  'col-modec-dia-das-criancas-2026',
  NULL,
  114,
  '{"id":"photo-modec-dia-das-criancas-2026-114","fileName":"MODEC-114.jpg","alt":"Fotografia 114 de MODEC DIA DAS CRIANÇAS 2026","width":3274,"height":4911,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1ZLY2Il39Ny65aWv5uJ6klj-9vGV1n0iN=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZLY2Il39Ny65aWv5uJ6klj-9vGV1n0iN=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZLY2Il39Ny65aWv5uJ6klj-9vGV1n0iN=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZLY2Il39Ny65aWv5uJ6klj-9vGV1n0iN=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ZLY2Il39Ny65aWv5uJ6klj-9vGV1n0iN=s0","width":3274,"height":4911,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1ZLY2Il39Ny65aWv5uJ6klj-9vGV1n0iN=s0","shareUrl":"1ZLY2Il39Ny65aWv5uJ6klj-9vGV1n0iN","position":114,"positionTieBreaker":"MODEC-114.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-115',
  'col-modec-dia-das-criancas-2026',
  NULL,
  115,
  '{"id":"photo-modec-dia-das-criancas-2026-115","fileName":"MODEC-115.jpg","alt":"Fotografia 115 de MODEC DIA DAS CRIANÇAS 2026","width":3450,"height":5175,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1ltaJzCHslNwrQdmbp2f_2TG-g0xxJ3b3=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ltaJzCHslNwrQdmbp2f_2TG-g0xxJ3b3=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ltaJzCHslNwrQdmbp2f_2TG-g0xxJ3b3=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ltaJzCHslNwrQdmbp2f_2TG-g0xxJ3b3=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ltaJzCHslNwrQdmbp2f_2TG-g0xxJ3b3=s0","width":3450,"height":5175,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1ltaJzCHslNwrQdmbp2f_2TG-g0xxJ3b3=s0","shareUrl":"1ltaJzCHslNwrQdmbp2f_2TG-g0xxJ3b3","position":115,"positionTieBreaker":"MODEC-115.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-116',
  'col-modec-dia-das-criancas-2026',
  NULL,
  116,
  '{"id":"photo-modec-dia-das-criancas-2026-116","fileName":"MODEC-116.jpg","alt":"Fotografia 116 de MODEC DIA DAS CRIANÇAS 2026","width":5517,"height":3678,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1fC75LcmxxcYqSg0aOkn35SKWmKIBzc8X=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1fC75LcmxxcYqSg0aOkn35SKWmKIBzc8X=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1fC75LcmxxcYqSg0aOkn35SKWmKIBzc8X=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1fC75LcmxxcYqSg0aOkn35SKWmKIBzc8X=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1fC75LcmxxcYqSg0aOkn35SKWmKIBzc8X=s0","width":5517,"height":3678,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1fC75LcmxxcYqSg0aOkn35SKWmKIBzc8X=s0","shareUrl":"1fC75LcmxxcYqSg0aOkn35SKWmKIBzc8X","position":116,"positionTieBreaker":"MODEC-116.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-117',
  'col-modec-dia-das-criancas-2026',
  NULL,
  117,
  '{"id":"photo-modec-dia-das-criancas-2026-117","fileName":"MODEC-117.jpg","alt":"Fotografia 117 de MODEC DIA DAS CRIANÇAS 2026","width":3335,"height":5002,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1hVXu0UP3xXvtpm72WmwomsHKsKCCZfob=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1hVXu0UP3xXvtpm72WmwomsHKsKCCZfob=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1hVXu0UP3xXvtpm72WmwomsHKsKCCZfob=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1hVXu0UP3xXvtpm72WmwomsHKsKCCZfob=w3600","width":3600,"height":5399,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1hVXu0UP3xXvtpm72WmwomsHKsKCCZfob=s0","width":3335,"height":5002,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1hVXu0UP3xXvtpm72WmwomsHKsKCCZfob=s0","shareUrl":"1hVXu0UP3xXvtpm72WmwomsHKsKCCZfob","position":117,"positionTieBreaker":"MODEC-117.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-118',
  'col-modec-dia-das-criancas-2026',
  NULL,
  118,
  '{"id":"photo-modec-dia-das-criancas-2026-118","fileName":"MODEC-118.jpg","alt":"Fotografia 118 de MODEC DIA DAS CRIANÇAS 2026","width":5160,"height":3440,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1LdEluCeSxIvhQ6-o2qdxbfaGvV2p-vhy=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1LdEluCeSxIvhQ6-o2qdxbfaGvV2p-vhy=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1LdEluCeSxIvhQ6-o2qdxbfaGvV2p-vhy=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1LdEluCeSxIvhQ6-o2qdxbfaGvV2p-vhy=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1LdEluCeSxIvhQ6-o2qdxbfaGvV2p-vhy=s0","width":5160,"height":3440,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1LdEluCeSxIvhQ6-o2qdxbfaGvV2p-vhy=s0","shareUrl":"1LdEluCeSxIvhQ6-o2qdxbfaGvV2p-vhy","position":118,"positionTieBreaker":"MODEC-118.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-119',
  'col-modec-dia-das-criancas-2026',
  NULL,
  119,
  '{"id":"photo-modec-dia-das-criancas-2026-119","fileName":"MODEC-119.jpg","alt":"Fotografia 119 de MODEC DIA DAS CRIANÇAS 2026","width":3213,"height":4819,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/12fCad4N1TFYOagTmhBTNW9koHYCmkAPN=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/12fCad4N1TFYOagTmhBTNW9koHYCmkAPN=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/12fCad4N1TFYOagTmhBTNW9koHYCmkAPN=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/12fCad4N1TFYOagTmhBTNW9koHYCmkAPN=w3600","width":3600,"height":5399,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/12fCad4N1TFYOagTmhBTNW9koHYCmkAPN=s0","width":3213,"height":4819,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/12fCad4N1TFYOagTmhBTNW9koHYCmkAPN=s0","shareUrl":"12fCad4N1TFYOagTmhBTNW9koHYCmkAPN","position":119,"positionTieBreaker":"MODEC-119.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-120',
  'col-modec-dia-das-criancas-2026',
  NULL,
  120,
  '{"id":"photo-modec-dia-das-criancas-2026-120","fileName":"MODEC-120.jpg","alt":"Fotografia 120 de MODEC DIA DAS CRIANÇAS 2026","width":3746,"height":5619,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1PYLkYZiKbRM0CFQ3xZ6pc7TLn9V8lA3W=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1PYLkYZiKbRM0CFQ3xZ6pc7TLn9V8lA3W=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1PYLkYZiKbRM0CFQ3xZ6pc7TLn9V8lA3W=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1PYLkYZiKbRM0CFQ3xZ6pc7TLn9V8lA3W=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1PYLkYZiKbRM0CFQ3xZ6pc7TLn9V8lA3W=s0","width":3746,"height":5619,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1PYLkYZiKbRM0CFQ3xZ6pc7TLn9V8lA3W=s0","shareUrl":"1PYLkYZiKbRM0CFQ3xZ6pc7TLn9V8lA3W","position":120,"positionTieBreaker":"MODEC-120.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-121',
  'col-modec-dia-das-criancas-2026',
  NULL,
  121,
  '{"id":"photo-modec-dia-das-criancas-2026-121","fileName":"MODEC-121.jpg","alt":"Fotografia 121 de MODEC DIA DAS CRIANÇAS 2026","width":3619,"height":5429,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/18xUltPEu1j1iU3ZBCgs6zaMK20Sxv2OI=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/18xUltPEu1j1iU3ZBCgs6zaMK20Sxv2OI=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/18xUltPEu1j1iU3ZBCgs6zaMK20Sxv2OI=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/18xUltPEu1j1iU3ZBCgs6zaMK20Sxv2OI=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/18xUltPEu1j1iU3ZBCgs6zaMK20Sxv2OI=s0","width":3619,"height":5429,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/18xUltPEu1j1iU3ZBCgs6zaMK20Sxv2OI=s0","shareUrl":"18xUltPEu1j1iU3ZBCgs6zaMK20Sxv2OI","position":121,"positionTieBreaker":"MODEC-121.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-122',
  'col-modec-dia-das-criancas-2026',
  NULL,
  122,
  '{"id":"photo-modec-dia-das-criancas-2026-122","fileName":"MODEC-122.jpg","alt":"Fotografia 122 de MODEC DIA DAS CRIANÇAS 2026","width":3301,"height":4952,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/17S2spVJxN4hYqbfRS4rt74EB71RjtBsJ=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/17S2spVJxN4hYqbfRS4rt74EB71RjtBsJ=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/17S2spVJxN4hYqbfRS4rt74EB71RjtBsJ=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/17S2spVJxN4hYqbfRS4rt74EB71RjtBsJ=w3600","width":3600,"height":5401,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/17S2spVJxN4hYqbfRS4rt74EB71RjtBsJ=s0","width":3301,"height":4952,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/17S2spVJxN4hYqbfRS4rt74EB71RjtBsJ=s0","shareUrl":"17S2spVJxN4hYqbfRS4rt74EB71RjtBsJ","position":122,"positionTieBreaker":"MODEC-122.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-123',
  'col-modec-dia-das-criancas-2026',
  NULL,
  123,
  '{"id":"photo-modec-dia-das-criancas-2026-123","fileName":"MODEC-123.jpg","alt":"Fotografia 123 de MODEC DIA DAS CRIANÇAS 2026","width":3326,"height":4990,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1QNR04xIw8o7EYtEOxP-BJfmk1dHLWCuU=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1QNR04xIw8o7EYtEOxP-BJfmk1dHLWCuU=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1QNR04xIw8o7EYtEOxP-BJfmk1dHLWCuU=w2048","width":2048,"height":3073,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1QNR04xIw8o7EYtEOxP-BJfmk1dHLWCuU=w3600","width":3600,"height":5401,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1QNR04xIw8o7EYtEOxP-BJfmk1dHLWCuU=s0","width":3326,"height":4990,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1QNR04xIw8o7EYtEOxP-BJfmk1dHLWCuU=s0","shareUrl":"1QNR04xIw8o7EYtEOxP-BJfmk1dHLWCuU","position":123,"positionTieBreaker":"MODEC-123.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-124',
  'col-modec-dia-das-criancas-2026',
  NULL,
  124,
  '{"id":"photo-modec-dia-das-criancas-2026-124","fileName":"MODEC-124.jpg","alt":"Fotografia 124 de MODEC DIA DAS CRIANÇAS 2026","width":2502,"height":3754,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1idXse_ePuYbxiOs9X3xl-R0AWOOmnIHU=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1idXse_ePuYbxiOs9X3xl-R0AWOOmnIHU=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1idXse_ePuYbxiOs9X3xl-R0AWOOmnIHU=w2048","width":2048,"height":3073,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1idXse_ePuYbxiOs9X3xl-R0AWOOmnIHU=s0","width":2502,"height":3754,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1idXse_ePuYbxiOs9X3xl-R0AWOOmnIHU=s0","shareUrl":"1idXse_ePuYbxiOs9X3xl-R0AWOOmnIHU","position":124,"positionTieBreaker":"MODEC-124.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-125',
  'col-modec-dia-das-criancas-2026',
  NULL,
  125,
  '{"id":"photo-modec-dia-das-criancas-2026-125","fileName":"MODEC-125.jpg","alt":"Fotografia 125 de MODEC DIA DAS CRIANÇAS 2026","width":2164,"height":3247,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1Vl03BXF-kn82z7FJgBcZauENyyKrEoy7=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Vl03BXF-kn82z7FJgBcZauENyyKrEoy7=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Vl03BXF-kn82z7FJgBcZauENyyKrEoy7=w2048","width":2048,"height":3073,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Vl03BXF-kn82z7FJgBcZauENyyKrEoy7=s0","width":2164,"height":3247,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1Vl03BXF-kn82z7FJgBcZauENyyKrEoy7=s0","shareUrl":"1Vl03BXF-kn82z7FJgBcZauENyyKrEoy7","position":125,"positionTieBreaker":"MODEC-125.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-126',
  'col-modec-dia-das-criancas-2026',
  NULL,
  126,
  '{"id":"photo-modec-dia-das-criancas-2026-126","fileName":"MODEC-126.jpg","alt":"Fotografia 126 de MODEC DIA DAS CRIANÇAS 2026","width":2624,"height":3936,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1FZpVe0USz_HN0eL_ApY2ahWcaSZ8uN18=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1FZpVe0USz_HN0eL_ApY2ahWcaSZ8uN18=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1FZpVe0USz_HN0eL_ApY2ahWcaSZ8uN18=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1FZpVe0USz_HN0eL_ApY2ahWcaSZ8uN18=s0","width":2624,"height":3936,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1FZpVe0USz_HN0eL_ApY2ahWcaSZ8uN18=s0","shareUrl":"1FZpVe0USz_HN0eL_ApY2ahWcaSZ8uN18","position":126,"positionTieBreaker":"MODEC-126.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-127',
  'col-modec-dia-das-criancas-2026',
  NULL,
  127,
  '{"id":"photo-modec-dia-das-criancas-2026-127","fileName":"MODEC-127.jpg","alt":"Fotografia 127 de MODEC DIA DAS CRIANÇAS 2026","width":6036,"height":4024,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1-qKaNGk74VpHLBE0hPMHRaulTIOdEyj2=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1-qKaNGk74VpHLBE0hPMHRaulTIOdEyj2=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1-qKaNGk74VpHLBE0hPMHRaulTIOdEyj2=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1-qKaNGk74VpHLBE0hPMHRaulTIOdEyj2=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1-qKaNGk74VpHLBE0hPMHRaulTIOdEyj2=s0","width":6036,"height":4024,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1-qKaNGk74VpHLBE0hPMHRaulTIOdEyj2=s0","shareUrl":"1-qKaNGk74VpHLBE0hPMHRaulTIOdEyj2","position":127,"positionTieBreaker":"MODEC-127.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-128',
  'col-modec-dia-das-criancas-2026',
  NULL,
  128,
  '{"id":"photo-modec-dia-das-criancas-2026-128","fileName":"MODEC-128.jpg","alt":"Fotografia 128 de MODEC DIA DAS CRIANÇAS 2026","width":2253,"height":3379,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1G3nIFut-hcAzGTuge0moF9SeUbyy7oI5=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1G3nIFut-hcAzGTuge0moF9SeUbyy7oI5=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1G3nIFut-hcAzGTuge0moF9SeUbyy7oI5=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1G3nIFut-hcAzGTuge0moF9SeUbyy7oI5=s0","width":2253,"height":3379,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1G3nIFut-hcAzGTuge0moF9SeUbyy7oI5=s0","shareUrl":"1G3nIFut-hcAzGTuge0moF9SeUbyy7oI5","position":128,"positionTieBreaker":"MODEC-128.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-129',
  'col-modec-dia-das-criancas-2026',
  NULL,
  129,
  '{"id":"photo-modec-dia-das-criancas-2026-129","fileName":"MODEC-129.jpg","alt":"Fotografia 129 de MODEC DIA DAS CRIANÇAS 2026","width":3603,"height":5405,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1Il0lxo2Lr-n-957lceYylkDttEPgzYjN=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Il0lxo2Lr-n-957lceYylkDttEPgzYjN=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Il0lxo2Lr-n-957lceYylkDttEPgzYjN=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Il0lxo2Lr-n-957lceYylkDttEPgzYjN=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Il0lxo2Lr-n-957lceYylkDttEPgzYjN=s0","width":3603,"height":5405,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1Il0lxo2Lr-n-957lceYylkDttEPgzYjN=s0","shareUrl":"1Il0lxo2Lr-n-957lceYylkDttEPgzYjN","position":129,"positionTieBreaker":"MODEC-129.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-130',
  'col-modec-dia-das-criancas-2026',
  NULL,
  130,
  '{"id":"photo-modec-dia-das-criancas-2026-130","fileName":"MODEC-130.jpg","alt":"Fotografia 130 de MODEC DIA DAS CRIANÇAS 2026","width":2503,"height":3754,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1LkUSCDg3zVpQvJTWF9qNTjGStDTEo-8y=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1LkUSCDg3zVpQvJTWF9qNTjGStDTEo-8y=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1LkUSCDg3zVpQvJTWF9qNTjGStDTEo-8y=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1LkUSCDg3zVpQvJTWF9qNTjGStDTEo-8y=s0","width":2503,"height":3754,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1LkUSCDg3zVpQvJTWF9qNTjGStDTEo-8y=s0","shareUrl":"1LkUSCDg3zVpQvJTWF9qNTjGStDTEo-8y","position":130,"positionTieBreaker":"MODEC-130.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-131',
  'col-modec-dia-das-criancas-2026',
  NULL,
  131,
  '{"id":"photo-modec-dia-das-criancas-2026-131","fileName":"MODEC-131.jpg","alt":"Fotografia 131 de MODEC DIA DAS CRIANÇAS 2026","width":5453,"height":3635,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/13pnguANoT_OMHr-ExEQtn3os1hOqfAAk=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/13pnguANoT_OMHr-ExEQtn3os1hOqfAAk=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/13pnguANoT_OMHr-ExEQtn3os1hOqfAAk=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/13pnguANoT_OMHr-ExEQtn3os1hOqfAAk=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/13pnguANoT_OMHr-ExEQtn3os1hOqfAAk=s0","width":5453,"height":3635,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/13pnguANoT_OMHr-ExEQtn3os1hOqfAAk=s0","shareUrl":"13pnguANoT_OMHr-ExEQtn3os1hOqfAAk","position":131,"positionTieBreaker":"MODEC-131.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-132',
  'col-modec-dia-das-criancas-2026',
  NULL,
  132,
  '{"id":"photo-modec-dia-das-criancas-2026-132","fileName":"MODEC-132.jpg","alt":"Fotografia 132 de MODEC DIA DAS CRIANÇAS 2026","width":2516,"height":3774,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1t7frsJ0e2XdMwSJuZnet-owdGdKYMc-1=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1t7frsJ0e2XdMwSJuZnet-owdGdKYMc-1=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1t7frsJ0e2XdMwSJuZnet-owdGdKYMc-1=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1t7frsJ0e2XdMwSJuZnet-owdGdKYMc-1=s0","width":2516,"height":3774,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1t7frsJ0e2XdMwSJuZnet-owdGdKYMc-1=s0","shareUrl":"1t7frsJ0e2XdMwSJuZnet-owdGdKYMc-1","position":132,"positionTieBreaker":"MODEC-132.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-133',
  'col-modec-dia-das-criancas-2026',
  NULL,
  133,
  '{"id":"photo-modec-dia-das-criancas-2026-133","fileName":"MODEC-133.jpg","alt":"Fotografia 133 de MODEC DIA DAS CRIANÇAS 2026","width":5878,"height":3664,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1BychuAbHRj9zsuwdAJW2aODoQBew74SR=w640","width":640,"height":399,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1BychuAbHRj9zsuwdAJW2aODoQBew74SR=w1024","width":1024,"height":638,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1BychuAbHRj9zsuwdAJW2aODoQBew74SR=w2048","width":2048,"height":1277,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1BychuAbHRj9zsuwdAJW2aODoQBew74SR=w3600","width":3600,"height":2244,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1BychuAbHRj9zsuwdAJW2aODoQBew74SR=s0","width":5878,"height":3664,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1BychuAbHRj9zsuwdAJW2aODoQBew74SR=s0","shareUrl":"1BychuAbHRj9zsuwdAJW2aODoQBew74SR","position":133,"positionTieBreaker":"MODEC-133.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-134',
  'col-modec-dia-das-criancas-2026',
  NULL,
  134,
  '{"id":"photo-modec-dia-das-criancas-2026-134","fileName":"MODEC-134.jpg","alt":"Fotografia 134 de MODEC DIA DAS CRIANÇAS 2026","width":4890,"height":3260,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1ItL1v6X9Kj7gj8LZ9Bg0wBp58Tt6O5D8=w640","width":640,"height":427,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ItL1v6X9Kj7gj8LZ9Bg0wBp58Tt6O5D8=w1024","width":1024,"height":683,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ItL1v6X9Kj7gj8LZ9Bg0wBp58Tt6O5D8=w2048","width":2048,"height":1365,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ItL1v6X9Kj7gj8LZ9Bg0wBp58Tt6O5D8=w3600","width":3600,"height":2400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1ItL1v6X9Kj7gj8LZ9Bg0wBp58Tt6O5D8=s0","width":4890,"height":3260,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1ItL1v6X9Kj7gj8LZ9Bg0wBp58Tt6O5D8=s0","shareUrl":"1ItL1v6X9Kj7gj8LZ9Bg0wBp58Tt6O5D8","position":134,"positionTieBreaker":"MODEC-134.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-135',
  'col-modec-dia-das-criancas-2026',
  NULL,
  135,
  '{"id":"photo-modec-dia-das-criancas-2026-135","fileName":"MODEC-135.jpg","alt":"Fotografia 135 de MODEC DIA DAS CRIANÇAS 2026","width":5798,"height":3490,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1JZDDrcoYiMuO2Y-ByDTjmWyy8hR1DJq-=w640","width":640,"height":385,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1JZDDrcoYiMuO2Y-ByDTjmWyy8hR1DJq-=w1024","width":1024,"height":616,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1JZDDrcoYiMuO2Y-ByDTjmWyy8hR1DJq-=w2048","width":2048,"height":1233,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1JZDDrcoYiMuO2Y-ByDTjmWyy8hR1DJq-=w3600","width":3600,"height":2167,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1JZDDrcoYiMuO2Y-ByDTjmWyy8hR1DJq-=s0","width":5798,"height":3490,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1JZDDrcoYiMuO2Y-ByDTjmWyy8hR1DJq-=s0","shareUrl":"1JZDDrcoYiMuO2Y-ByDTjmWyy8hR1DJq-","position":135,"positionTieBreaker":"MODEC-135.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-136',
  'col-modec-dia-das-criancas-2026',
  NULL,
  136,
  '{"id":"photo-modec-dia-das-criancas-2026-136","fileName":"MODEC-136.jpg","alt":"Fotografia 136 de MODEC DIA DAS CRIANÇAS 2026","width":3389,"height":5084,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/11Qlj_bBKOg__cd7knpmEIQxixV5OotbK=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/11Qlj_bBKOg__cd7knpmEIQxixV5OotbK=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/11Qlj_bBKOg__cd7knpmEIQxixV5OotbK=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/11Qlj_bBKOg__cd7knpmEIQxixV5OotbK=w3600","width":3600,"height":5401,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/11Qlj_bBKOg__cd7knpmEIQxixV5OotbK=s0","width":3389,"height":5084,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/11Qlj_bBKOg__cd7knpmEIQxixV5OotbK=s0","shareUrl":"11Qlj_bBKOg__cd7knpmEIQxixV5OotbK","position":136,"positionTieBreaker":"MODEC-136.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-137',
  'col-modec-dia-das-criancas-2026',
  NULL,
  137,
  '{"id":"photo-modec-dia-das-criancas-2026-137","fileName":"MODEC-137.jpg","alt":"Fotografia 137 de MODEC DIA DAS CRIANÇAS 2026","width":2051,"height":3070,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1aRzhth2cOzCBa_Joa0C7iOT1ZnQrua8Z=w640","width":640,"height":958,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1aRzhth2cOzCBa_Joa0C7iOT1ZnQrua8Z=w1024","width":1024,"height":1533,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1aRzhth2cOzCBa_Joa0C7iOT1ZnQrua8Z=w2048","width":2048,"height":3066,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1aRzhth2cOzCBa_Joa0C7iOT1ZnQrua8Z=s0","width":2051,"height":3070,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1aRzhth2cOzCBa_Joa0C7iOT1ZnQrua8Z=s0","shareUrl":"1aRzhth2cOzCBa_Joa0C7iOT1ZnQrua8Z","position":137,"positionTieBreaker":"MODEC-137.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-138',
  'col-modec-dia-das-criancas-2026',
  NULL,
  138,
  '{"id":"photo-modec-dia-das-criancas-2026-138","fileName":"MODEC-138.jpg","alt":"Fotografia 138 de MODEC DIA DAS CRIANÇAS 2026","width":2643,"height":3964,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/19Z0M9tI9IBUoPDDAzyoT6gNO5yWiVk8i=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/19Z0M9tI9IBUoPDDAzyoT6gNO5yWiVk8i=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/19Z0M9tI9IBUoPDDAzyoT6gNO5yWiVk8i=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/19Z0M9tI9IBUoPDDAzyoT6gNO5yWiVk8i=s0","width":2643,"height":3964,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/19Z0M9tI9IBUoPDDAzyoT6gNO5yWiVk8i=s0","shareUrl":"19Z0M9tI9IBUoPDDAzyoT6gNO5yWiVk8i","position":138,"positionTieBreaker":"MODEC-138.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-139',
  'col-modec-dia-das-criancas-2026',
  NULL,
  139,
  '{"id":"photo-modec-dia-das-criancas-2026-139","fileName":"MODEC-139.jpg","alt":"Fotografia 139 de MODEC DIA DAS CRIANÇAS 2026","width":3214,"height":2147,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1JMFHOiChxKGe8NsCUys1fM_rBpVLPWu9=w640","width":640,"height":428,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1JMFHOiChxKGe8NsCUys1fM_rBpVLPWu9=w1024","width":1024,"height":684,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1JMFHOiChxKGe8NsCUys1fM_rBpVLPWu9=w2048","width":2048,"height":1368,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1JMFHOiChxKGe8NsCUys1fM_rBpVLPWu9=w3600","width":3600,"height":2405,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1JMFHOiChxKGe8NsCUys1fM_rBpVLPWu9=s0","width":3214,"height":2147,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1JMFHOiChxKGe8NsCUys1fM_rBpVLPWu9=s0","shareUrl":"1JMFHOiChxKGe8NsCUys1fM_rBpVLPWu9","position":139,"positionTieBreaker":"MODEC-139.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-140',
  'col-modec-dia-das-criancas-2026',
  NULL,
  140,
  '{"id":"photo-modec-dia-das-criancas-2026-140","fileName":"MODEC-140.jpg","alt":"Fotografia 140 de MODEC DIA DAS CRIANÇAS 2026","width":3573,"height":5359,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/17xVT6kFfv9dTEaKDmQwo4EJmuBQ9hvPz=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/17xVT6kFfv9dTEaKDmQwo4EJmuBQ9hvPz=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/17xVT6kFfv9dTEaKDmQwo4EJmuBQ9hvPz=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/17xVT6kFfv9dTEaKDmQwo4EJmuBQ9hvPz=w3600","width":3600,"height":5399,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/17xVT6kFfv9dTEaKDmQwo4EJmuBQ9hvPz=s0","width":3573,"height":5359,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/17xVT6kFfv9dTEaKDmQwo4EJmuBQ9hvPz=s0","shareUrl":"17xVT6kFfv9dTEaKDmQwo4EJmuBQ9hvPz","position":140,"positionTieBreaker":"MODEC-140.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-141',
  'col-modec-dia-das-criancas-2026',
  NULL,
  141,
  '{"id":"photo-modec-dia-das-criancas-2026-141","fileName":"MODEC-141.jpg","alt":"Fotografia 141 de MODEC DIA DAS CRIANÇAS 2026","width":2346,"height":3519,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1iVHWLgfsB7r_vreWP5c60a5vIg4FMGQq=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1iVHWLgfsB7r_vreWP5c60a5vIg4FMGQq=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1iVHWLgfsB7r_vreWP5c60a5vIg4FMGQq=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1iVHWLgfsB7r_vreWP5c60a5vIg4FMGQq=s0","width":2346,"height":3519,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1iVHWLgfsB7r_vreWP5c60a5vIg4FMGQq=s0","shareUrl":"1iVHWLgfsB7r_vreWP5c60a5vIg4FMGQq","position":141,"positionTieBreaker":"MODEC-141.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-142',
  'col-modec-dia-das-criancas-2026',
  NULL,
  142,
  '{"id":"photo-modec-dia-das-criancas-2026-142","fileName":"MODEC-142.jpg","alt":"Fotografia 142 de MODEC DIA DAS CRIANÇAS 2026","width":2532,"height":3798,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1PPNg-GWN_1cfU3vDq9euEM2-iFN7bGk4=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1PPNg-GWN_1cfU3vDq9euEM2-iFN7bGk4=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1PPNg-GWN_1cfU3vDq9euEM2-iFN7bGk4=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1PPNg-GWN_1cfU3vDq9euEM2-iFN7bGk4=s0","width":2532,"height":3798,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1PPNg-GWN_1cfU3vDq9euEM2-iFN7bGk4=s0","shareUrl":"1PPNg-GWN_1cfU3vDq9euEM2-iFN7bGk4","position":142,"positionTieBreaker":"MODEC-142.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-143',
  'col-modec-dia-das-criancas-2026',
  NULL,
  143,
  '{"id":"photo-modec-dia-das-criancas-2026-143","fileName":"MODEC-143.jpg","alt":"Fotografia 143 de MODEC DIA DAS CRIANÇAS 2026","width":5545,"height":3433,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1bW1eyPpDrMULLXJ1zuxDj239hiNfmgzy=w640","width":640,"height":396,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1bW1eyPpDrMULLXJ1zuxDj239hiNfmgzy=w1024","width":1024,"height":634,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1bW1eyPpDrMULLXJ1zuxDj239hiNfmgzy=w2048","width":2048,"height":1268,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1bW1eyPpDrMULLXJ1zuxDj239hiNfmgzy=w3600","width":3600,"height":2229,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1bW1eyPpDrMULLXJ1zuxDj239hiNfmgzy=s0","width":5545,"height":3433,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1bW1eyPpDrMULLXJ1zuxDj239hiNfmgzy=s0","shareUrl":"1bW1eyPpDrMULLXJ1zuxDj239hiNfmgzy","position":143,"positionTieBreaker":"MODEC-143.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-144',
  'col-modec-dia-das-criancas-2026',
  NULL,
  144,
  '{"id":"photo-modec-dia-das-criancas-2026-144","fileName":"MODEC-144.jpg","alt":"Fotografia 144 de MODEC DIA DAS CRIANÇAS 2026","width":2450,"height":3675,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1P4dt2RAeFXpYGyLlF0E50sABcv3bDSx6=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1P4dt2RAeFXpYGyLlF0E50sABcv3bDSx6=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1P4dt2RAeFXpYGyLlF0E50sABcv3bDSx6=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1P4dt2RAeFXpYGyLlF0E50sABcv3bDSx6=s0","width":2450,"height":3675,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1P4dt2RAeFXpYGyLlF0E50sABcv3bDSx6=s0","shareUrl":"1P4dt2RAeFXpYGyLlF0E50sABcv3bDSx6","position":144,"positionTieBreaker":"MODEC-144.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-145',
  'col-modec-dia-das-criancas-2026',
  NULL,
  145,
  '{"id":"photo-modec-dia-das-criancas-2026-145","fileName":"MODEC-145.jpg","alt":"Fotografia 145 de MODEC DIA DAS CRIANÇAS 2026","width":4024,"height":6036,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/186KKO1wpxy5IXDlvXrmIYjvb691bJ81b=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/186KKO1wpxy5IXDlvXrmIYjvb691bJ81b=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/186KKO1wpxy5IXDlvXrmIYjvb691bJ81b=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/186KKO1wpxy5IXDlvXrmIYjvb691bJ81b=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/186KKO1wpxy5IXDlvXrmIYjvb691bJ81b=s0","width":4024,"height":6036,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/186KKO1wpxy5IXDlvXrmIYjvb691bJ81b=s0","shareUrl":"186KKO1wpxy5IXDlvXrmIYjvb691bJ81b","position":145,"positionTieBreaker":"MODEC-145.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-146',
  'col-modec-dia-das-criancas-2026',
  NULL,
  146,
  '{"id":"photo-modec-dia-das-criancas-2026-146","fileName":"MODEC-146.jpg","alt":"Fotografia 146 de MODEC DIA DAS CRIANÇAS 2026","width":3728,"height":5592,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1QVusfs7nITAsHDdiqjJUd_K0-oBYzaBh=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1QVusfs7nITAsHDdiqjJUd_K0-oBYzaBh=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1QVusfs7nITAsHDdiqjJUd_K0-oBYzaBh=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1QVusfs7nITAsHDdiqjJUd_K0-oBYzaBh=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1QVusfs7nITAsHDdiqjJUd_K0-oBYzaBh=s0","width":3728,"height":5592,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1QVusfs7nITAsHDdiqjJUd_K0-oBYzaBh=s0","shareUrl":"1QVusfs7nITAsHDdiqjJUd_K0-oBYzaBh","position":146,"positionTieBreaker":"MODEC-146.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-147',
  'col-modec-dia-das-criancas-2026',
  NULL,
  147,
  '{"id":"photo-modec-dia-das-criancas-2026-147","fileName":"MODEC-147.jpg","alt":"Fotografia 147 de MODEC DIA DAS CRIANÇAS 2026","width":3693,"height":5540,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1uf32Rd4MqvfQwwvI632XNTypPWRepTL3=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1uf32Rd4MqvfQwwvI632XNTypPWRepTL3=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1uf32Rd4MqvfQwwvI632XNTypPWRepTL3=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1uf32Rd4MqvfQwwvI632XNTypPWRepTL3=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1uf32Rd4MqvfQwwvI632XNTypPWRepTL3=s0","width":3693,"height":5540,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1uf32Rd4MqvfQwwvI632XNTypPWRepTL3=s0","shareUrl":"1uf32Rd4MqvfQwwvI632XNTypPWRepTL3","position":147,"positionTieBreaker":"MODEC-147.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-148',
  'col-modec-dia-das-criancas-2026',
  NULL,
  148,
  '{"id":"photo-modec-dia-das-criancas-2026-148","fileName":"MODEC-148.jpg","alt":"Fotografia 148 de MODEC DIA DAS CRIANÇAS 2026","width":3268,"height":4902,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/159gypMPV-YqY3mEkC7hwRwvpyOxViPIB=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/159gypMPV-YqY3mEkC7hwRwvpyOxViPIB=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/159gypMPV-YqY3mEkC7hwRwvpyOxViPIB=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/159gypMPV-YqY3mEkC7hwRwvpyOxViPIB=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/159gypMPV-YqY3mEkC7hwRwvpyOxViPIB=s0","width":3268,"height":4902,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/159gypMPV-YqY3mEkC7hwRwvpyOxViPIB=s0","shareUrl":"159gypMPV-YqY3mEkC7hwRwvpyOxViPIB","position":148,"positionTieBreaker":"MODEC-148.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-149',
  'col-modec-dia-das-criancas-2026',
  NULL,
  149,
  '{"id":"photo-modec-dia-das-criancas-2026-149","fileName":"MODEC-149.jpg","alt":"Fotografia 149 de MODEC DIA DAS CRIANÇAS 2026","width":3329,"height":4993,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/18_1vzHSeqfM-Zl08BAz8AORsUF1sure4=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/18_1vzHSeqfM-Zl08BAz8AORsUF1sure4=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/18_1vzHSeqfM-Zl08BAz8AORsUF1sure4=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/18_1vzHSeqfM-Zl08BAz8AORsUF1sure4=w3600","width":3600,"height":5399,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/18_1vzHSeqfM-Zl08BAz8AORsUF1sure4=s0","width":3329,"height":4993,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/18_1vzHSeqfM-Zl08BAz8AORsUF1sure4=s0","shareUrl":"18_1vzHSeqfM-Zl08BAz8AORsUF1sure4","position":149,"positionTieBreaker":"MODEC-149.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-150',
  'col-modec-dia-das-criancas-2026',
  NULL,
  150,
  '{"id":"photo-modec-dia-das-criancas-2026-150","fileName":"MODEC-150.jpg","alt":"Fotografia 150 de MODEC DIA DAS CRIANÇAS 2026","width":3222,"height":4833,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1uxLWj0g9JhTaHz5nV8uz6OyHN8PBqMeB=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1uxLWj0g9JhTaHz5nV8uz6OyHN8PBqMeB=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1uxLWj0g9JhTaHz5nV8uz6OyHN8PBqMeB=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1uxLWj0g9JhTaHz5nV8uz6OyHN8PBqMeB=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1uxLWj0g9JhTaHz5nV8uz6OyHN8PBqMeB=s0","width":3222,"height":4833,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1uxLWj0g9JhTaHz5nV8uz6OyHN8PBqMeB=s0","shareUrl":"1uxLWj0g9JhTaHz5nV8uz6OyHN8PBqMeB","position":150,"positionTieBreaker":"MODEC-150.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-151',
  'col-modec-dia-das-criancas-2026',
  NULL,
  151,
  '{"id":"photo-modec-dia-das-criancas-2026-151","fileName":"MODEC-151.jpg","alt":"Fotografia 151 de MODEC DIA DAS CRIANÇAS 2026","width":2428,"height":3642,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1IbowQWPyrYLzgeYymA5rp-1aGN8ypTmA=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1IbowQWPyrYLzgeYymA5rp-1aGN8ypTmA=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1IbowQWPyrYLzgeYymA5rp-1aGN8ypTmA=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1IbowQWPyrYLzgeYymA5rp-1aGN8ypTmA=s0","width":2428,"height":3642,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1IbowQWPyrYLzgeYymA5rp-1aGN8ypTmA=s0","shareUrl":"1IbowQWPyrYLzgeYymA5rp-1aGN8ypTmA","position":151,"positionTieBreaker":"MODEC-151.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-152',
  'col-modec-dia-das-criancas-2026',
  NULL,
  152,
  '{"id":"photo-modec-dia-das-criancas-2026-152","fileName":"MODEC-152.jpg","alt":"Fotografia 152 de MODEC DIA DAS CRIANÇAS 2026","width":2624,"height":3936,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/11ng-Ea4hTS5C2zMj6yXwgxFn-bdocSq6=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/11ng-Ea4hTS5C2zMj6yXwgxFn-bdocSq6=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/11ng-Ea4hTS5C2zMj6yXwgxFn-bdocSq6=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/11ng-Ea4hTS5C2zMj6yXwgxFn-bdocSq6=s0","width":2624,"height":3936,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/11ng-Ea4hTS5C2zMj6yXwgxFn-bdocSq6=s0","shareUrl":"11ng-Ea4hTS5C2zMj6yXwgxFn-bdocSq6","position":152,"positionTieBreaker":"MODEC-152.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-153',
  'col-modec-dia-das-criancas-2026',
  NULL,
  153,
  '{"id":"photo-modec-dia-das-criancas-2026-153","fileName":"MODEC-153.jpg","alt":"Fotografia 153 de MODEC DIA DAS CRIANÇAS 2026","width":3730,"height":5595,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1Vwb4uFZVX9msAuhiiAhYE2Dcxh76ZYWh=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Vwb4uFZVX9msAuhiiAhYE2Dcxh76ZYWh=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Vwb4uFZVX9msAuhiiAhYE2Dcxh76ZYWh=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Vwb4uFZVX9msAuhiiAhYE2Dcxh76ZYWh=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1Vwb4uFZVX9msAuhiiAhYE2Dcxh76ZYWh=s0","width":3730,"height":5595,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1Vwb4uFZVX9msAuhiiAhYE2Dcxh76ZYWh=s0","shareUrl":"1Vwb4uFZVX9msAuhiiAhYE2Dcxh76ZYWh","position":153,"positionTieBreaker":"MODEC-153.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-154',
  'col-modec-dia-das-criancas-2026',
  NULL,
  154,
  '{"id":"photo-modec-dia-das-criancas-2026-154","fileName":"MODEC-154.jpg","alt":"Fotografia 154 de MODEC DIA DAS CRIANÇAS 2026","width":2325,"height":3488,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1cTdBBRQeqdPkp0eyQMGBALzjZC0qhcLV=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1cTdBBRQeqdPkp0eyQMGBALzjZC0qhcLV=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1cTdBBRQeqdPkp0eyQMGBALzjZC0qhcLV=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1cTdBBRQeqdPkp0eyQMGBALzjZC0qhcLV=s0","width":2325,"height":3488,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1cTdBBRQeqdPkp0eyQMGBALzjZC0qhcLV=s0","shareUrl":"1cTdBBRQeqdPkp0eyQMGBALzjZC0qhcLV","position":154,"positionTieBreaker":"MODEC-154.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-155',
  'col-modec-dia-das-criancas-2026',
  NULL,
  155,
  '{"id":"photo-modec-dia-das-criancas-2026-155","fileName":"MODEC-155.jpg","alt":"Fotografia 155 de MODEC DIA DAS CRIANÇAS 2026","width":2223,"height":3335,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1PTpQwOMamaDJSXKJ-k_8SZHkDwfLGTXD=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1PTpQwOMamaDJSXKJ-k_8SZHkDwfLGTXD=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1PTpQwOMamaDJSXKJ-k_8SZHkDwfLGTXD=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1PTpQwOMamaDJSXKJ-k_8SZHkDwfLGTXD=s0","width":2223,"height":3335,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1PTpQwOMamaDJSXKJ-k_8SZHkDwfLGTXD=s0","shareUrl":"1PTpQwOMamaDJSXKJ-k_8SZHkDwfLGTXD","position":155,"positionTieBreaker":"MODEC-155.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-156',
  'col-modec-dia-das-criancas-2026',
  NULL,
  156,
  '{"id":"photo-modec-dia-das-criancas-2026-156","fileName":"MODEC-156.jpg","alt":"Fotografia 156 de MODEC DIA DAS CRIANÇAS 2026","width":4024,"height":6036,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/1JVkuH_uqGZZvDOObCvRj-iXytQAgIx50=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1JVkuH_uqGZZvDOObCvRj-iXytQAgIx50=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1JVkuH_uqGZZvDOObCvRj-iXytQAgIx50=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1JVkuH_uqGZZvDOObCvRj-iXytQAgIx50=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/1JVkuH_uqGZZvDOObCvRj-iXytQAgIx50=s0","width":4024,"height":6036,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/1JVkuH_uqGZZvDOObCvRj-iXytQAgIx50=s0","shareUrl":"1JVkuH_uqGZZvDOObCvRj-iXytQAgIx50","position":156,"positionTieBreaker":"MODEC-156.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-157',
  'col-modec-dia-das-criancas-2026',
  NULL,
  157,
  '{"id":"photo-modec-dia-das-criancas-2026-157","fileName":"MODEC-157.jpg","alt":"Fotografia 157 de MODEC DIA DAS CRIANÇAS 2026","width":3842,"height":5763,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/10HZdFFyVtWe7bHJWriwxpzFfknsFx5IX=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/10HZdFFyVtWe7bHJWriwxpzFfknsFx5IX=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/10HZdFFyVtWe7bHJWriwxpzFfknsFx5IX=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/10HZdFFyVtWe7bHJWriwxpzFfknsFx5IX=w3600","width":3600,"height":5400,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/10HZdFFyVtWe7bHJWriwxpzFfknsFx5IX=s0","width":3842,"height":5763,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/10HZdFFyVtWe7bHJWriwxpzFfknsFx5IX=s0","shareUrl":"10HZdFFyVtWe7bHJWriwxpzFfknsFx5IX","position":157,"positionTieBreaker":"MODEC-157.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

INSERT INTO public.photos (
  id, collection_id, set_id, position, data
) VALUES (
  'photo-modec-dia-das-criancas-2026-158',
  'col-modec-dia-das-criancas-2026',
  NULL,
  158,
  '{"id":"photo-modec-dia-das-criancas-2026-158","fileName":"MODEC-158.jpg","alt":"Fotografia 158 de MODEC DIA DAS CRIANÇAS 2026","width":2871,"height":4307,"focalPoint":{"x":50,"y":50},"dominantColor":"#181b20","sources":[{"url":"https://lh3.googleusercontent.com/d/11aNmmfvzWjjL3IWhQjjFUqPNSuCuX9SJ=w640","width":640,"height":960,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/11aNmmfvzWjjL3IWhQjjFUqPNSuCuX9SJ=w1024","width":1024,"height":1536,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/11aNmmfvzWjjL3IWhQjjFUqPNSuCuX9SJ=w2048","width":2048,"height":3072,"format":"jpeg"},{"url":"https://lh3.googleusercontent.com/d/11aNmmfvzWjjL3IWhQjjFUqPNSuCuX9SJ=s0","width":2871,"height":4307,"format":"jpeg"}],"downloadUrl":"https://lh3.googleusercontent.com/d/11aNmmfvzWjjL3IWhQjjFUqPNSuCuX9SJ=s0","shareUrl":"11aNmmfvzWjjL3IWhQjjFUqPNSuCuX9SJ","position":158,"positionTieBreaker":"MODEC-158.jpg"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  collection_id = EXCLUDED.collection_id,
  set_id = EXCLUDED.set_id,
  position = EXCLUDED.position,
  data = EXCLUDED.data;

COMMIT;
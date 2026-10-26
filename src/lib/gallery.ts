import { useEffect, useMemo, useState } from 'react';
import { collectionFixture, galleryPhotos } from '../data/fixtures';

export function GalleryPageStateDebug() {
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  const selectedPhoto = useMemo(
    () => (selectedPhotoId ? galleryPhotos.find((photo) => photo.id === selectedPhotoId) ?? null : null),
    [selectedPhotoId],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const photoId = params.get('photo');
    setSelectedPhotoId(photoId && galleryPhotos.some((photo) => photo.id === photoId) ? photoId : null);
  }, []);

  return (
    <div style={{ color: '#fff', padding: '2rem' }}>
      <h2>Gallery state</h2>
      <p>Collection: {collectionFixture.title}</p>
      <p>Items loaded: {galleryPhotos.length}</p>
      <p>Selected photo: {selectedPhoto?.id ?? 'none'}</p>
    </div>
  );
}

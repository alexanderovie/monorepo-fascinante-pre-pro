/**
 * Media Gallery Component
 *
 * ÉLITE PRO: Componente para mostrar galería de fotos y videos
 * según estándares de la industria.
 *
 * Características:
 * - Grid responsive de media
 * - Soporte para fotos y videos
 * - Lightbox para vista ampliada
 * - Lazy loading
 */

'use client'

import { useState } from 'react'
import type { GBPMedia } from '@/lib/gbp/types'

interface MediaGalleryProps {
  media: GBPMedia[]
}

export default function MediaGallery({ media }: MediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<GBPMedia | null>(null)

  // ÉLITE: Filtrar fotos y videos
  const photos = media.filter((m) => m.mediaFormat === 'PHOTO')
  const videos = media.filter((m) => m.mediaFormat === 'VIDEO')

  return (
    <div className="space-y-6">
      {/* Fotos */}
      {photos.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Fotos ({photos.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.name || index}
                className="relative aspect-square cursor-pointer group"
                onClick={() => setSelectedMedia(photo)}
              >
                <img
                  src={photo.thumbnailUrl || photo.sourceUrl || photo.googleUrl || ''}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-neutral-700 group-hover:opacity-90 transition-opacity"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                  <svg
                    className="size-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Videos ({videos.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video, index) => (
              <div
                key={video.name || index}
                className="relative aspect-video cursor-pointer group"
                onClick={() => setSelectedMedia(video)}
              >
                {video.thumbnailUrl ? (
                  <>
                    <img
                      src={video.thumbnailUrl}
                      alt={`Video ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-neutral-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="size-16 text-white opacity-80"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
                    <svg className="size-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {media.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto size-12 text-gray-400 dark:text-neutral-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-500 dark:text-neutral-400">No hay media disponible</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            {selectedMedia.mediaFormat === 'PHOTO' ? (
              <img
                src={selectedMedia.sourceUrl || selectedMedia.googleUrl || selectedMedia.thumbnailUrl || ''}
                alt="Media ampliada"
                className="max-w-full max-h-[90vh] rounded-lg"
              />
            ) : (
              <div className="bg-black rounded-lg p-4">
                {selectedMedia.sourceUrl ? (
                  <video
                    src={selectedMedia.sourceUrl}
                    controls
                    className="max-w-full max-h-[90vh]"
                  />
                ) : (
                  <p className="text-white">Video no disponible para reproducir</p>
                )}
              </div>
            )}
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
            >
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}



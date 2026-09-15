"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Photo = {
  id: number;
  created_at: string;
  storage_path: string;
};

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    loadApprovedPhotos();
  }, []);

  // ESC ile lightbox kapatma
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Lightbox açıkken sayfanın arkada kaymasını engelle
  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPhoto]);

  const loadApprovedPhotos = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("photos")
      .select("id, created_at, storage_path")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GALLERY ERROR:", error);
      setIsLoading(false);
      return;
    }

    const photosWithUrls: Record<number, string> = {};

    await Promise.all(
      (data ?? []).map(async (photo) => {
        const { data: signedUrlData, error: signedUrlError } =
          await supabase.storage
            .from("wedding-photos")
            .createSignedUrl(photo.storage_path, 3600);

        if (signedUrlError) {
          console.error("SIGNED URL ERROR:", signedUrlError);
          return;
        }

        photosWithUrls[photo.id] = signedUrlData.signedUrl;
      })
    );

    setPhotos(data ?? []);
    setSignedUrls(photosWithUrls);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="mt-14 text-center">
        <p className="text-sm text-[#9a8c82]">
          Anılar yükleniyor...
        </p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="mx-auto mt-14 max-w-md rounded-[24px] border border-[#d9c8bf] bg-[#f7eee9]/60 px-6 py-10 text-center">
        <p className="text-3xl text-[#b79d91]">♡</p>

        <p className="mt-4 font-serif text-2xl text-[#6f625a]">
          Henüz bir anı yok
        </p>

        <p className="mt-3 text-sm leading-7 text-[#8f857d]">
          Sizlerin güzel fotoğraflarıyla bu alan
          zamanla bizim için özel bir albüme dönüşecek.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* GALERİ */}
      <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
        {photos.map((photo, index) => {
          const imageUrl = signedUrls[photo.id];

          if (!imageUrl) return null;

          const isTall = index % 5 === 0;

          return (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelectedPhoto(imageUrl)}
              className={`group relative overflow-hidden rounded-[20px] bg-[#eee7df] text-left shadow-[0_12px_35px_rgba(70,55,45,0.08)] focus:outline-none focus:ring-2 focus:ring-[#b79d91]/50 ${
                isTall ? "md:row-span-2" : ""
              }`}
              aria-label="Fotoğrafı büyüt"
            >
              <div
                className={`overflow-hidden ${
                  isTall
                    ? "aspect-[3/4] md:h-full"
                    : "aspect-square"
                }`}
              >
               <img
  src={imageUrl}
  alt="Tuğba & Murat'ın anılarından"
  draggable={false}
  onContextMenu={(event) => event.preventDefault()}
  className="h-full w-full select-none object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
/>
              </div>

              {/* Hover efekti */}
              <div className="absolute inset-0 flex items-center justify-center bg-[#403a36]/0 transition-all duration-500 group-hover:bg-[#403a36]/20">
                <span className="flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-[#faf8f3]/90 text-lg text-[#6f625a] opacity-0 shadow-lg backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  ⌕
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* LIGHTBOX */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#292522]/85 px-4 py-6 backdrop-blur-md sm:px-8"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Kapat */}
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#faf8f3]/90 text-2xl font-light text-[#6f625a] shadow-lg transition hover:scale-105 hover:bg-[#faf8f3]"
            aria-label="Fotoğrafı kapat"
          >
            ×
          </button>

          {/* Fotoğraf */}
          <div
            className="relative flex max-h-full max-w-full items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
          <img
  src={selectedPhoto}
  alt="Büyütülmüş anı fotoğrafı"
  draggable={false}
  onContextMenu={(event) => event.preventDefault()}
  className="max-h-[90vh] max-w-[92vw] select-none rounded-[12px] object-contain shadow-[0_25px_80px_rgba(0,0,0,0.35)]"
/>
          </div>
        </div>
      )}
    </>
  );
}
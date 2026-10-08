"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 30 * 1024 * 1024;
const MAX_OUTPUT_SIZE = 6 * 1024 * 1024;
const MAX_IMAGE_WIDTH = 2400;
const JPEG_QUALITY = 0.82;

export default function PhotoUpload() {
  const [isOpen, setIsOpen] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Modal açıkken arka plandaki sayfanın scroll olmasını tamamen engelle
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";

    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";

      html.style.overscrollBehavior = "";
      body.style.overscrollBehavior = "";

      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // Preview URL'lerini component kapanırken temizle
  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

  // --------------------------------------------------
  // FOTOĞRAF SEÇME
  // --------------------------------------------------

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    setError("");
    setMessage("");

    if (selectedFiles.length === 0) {
      return;
    }

    if (selectedFiles.length > MAX_FILES) {
      setError(`En fazla ${MAX_FILES} fotoğraf seçebilirsiniz.`);
      event.target.value = "";
      return;
    }

    // Bütün dosyaları kontrol et
    for (const selectedFile of selectedFiles) {
      if (!selectedFile.type.startsWith("image/")) {
        setError("Lütfen sadece fotoğraf dosyaları seçin.");
        event.target.value = "";
        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        setError(
          `"${selectedFile.name}" 30 MB'dan büyük. Lütfen daha küçük bir fotoğraf seçin.`
        );
        event.target.value = "";
        return;
      }
    }

    // Eski preview'ları temizle
    previews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    const newPreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setFiles(selectedFiles);
    setPreviews(newPreviews);

    // Aynı dosyayı tekrar seçebilmek için input'u temizle
    event.target.value = "";
  };

  // --------------------------------------------------
  // FOTOĞRAF SIKIŞTIRMA
  // --------------------------------------------------

  const compressImage = async (originalFile: File): Promise<File> => {
    const imageUrl = URL.createObjectURL(originalFile);

    try {
      const image = new Image();

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () =>
          reject(new Error("Fotoğraf okunamadı."));
        image.src = imageUrl;
      });

      let width = image.naturalWidth;
      let height = image.naturalHeight;

      if (width > MAX_IMAGE_WIDTH) {
        const ratio = MAX_IMAGE_WIDTH / width;

        width = MAX_IMAGE_WIDTH;
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Fotoğraf işlenemedi.");
      }

      context.drawImage(image, 0, 0, width, height);

      let quality = JPEG_QUALITY;

      let blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality)
      );

      if (!blob) {
        throw new Error("Fotoğraf sıkıştırılamadı.");
      }

      while (blob.size > MAX_OUTPUT_SIZE && quality > 0.5) {
        quality -= 0.08;

        blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", quality)
        );

        if (!blob) {
          throw new Error("Fotoğraf sıkıştırılamadı.");
        }
      }

      return new File(
        [blob],
        `${originalFile.name.replace(/\.[^/.]+$/, "")}.jpg`,
        {
          type: "image/jpeg",
        }
      );
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  };

  // --------------------------------------------------
  // FOTOĞRAFLARI GÖNDER
  // --------------------------------------------------

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Önce en az bir fotoğraf seçmelisin.");
      return;
    }

    setIsUploading(true);
    setError("");
    setMessage("");

    const uploadedPaths: string[] = [];

    try {
      const compressedFiles: File[] = [];

      // Fotoğrafları tek tek sıkıştır
      for (let i = 0; i < files.length; i++) {
        setMessage(
          `${i + 1} / ${files.length} fotoğraf hazırlanıyor...`
        );

        const compressedFile = await compressImage(files[i]);

        compressedFiles.push(compressedFile);
      }

      // --------------------------------------------------
      // STORAGE'A YÜKLE
      // --------------------------------------------------

      for (let i = 0; i < compressedFiles.length; i++) {
        setMessage(
          `${i + 1} / ${compressedFiles.length} fotoğraf gönderiliyor...`
        );

        const fileName = `${crypto.randomUUID()}.jpg`;
        const filePath = `pending/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("wedding-photos")
          .upload(filePath, compressedFiles[i], {
            cacheControl: "3600",
            upsert: false,
            contentType: "image/jpeg",
          });

        if (uploadError) {
          throw uploadError;
        }

        uploadedPaths.push(filePath);
      }

      // --------------------------------------------------
      // DATABASE'E TOPLU KAYIT
      // --------------------------------------------------

      setMessage("Fotoğraflar kaydediliyor...");

      const databaseRows = uploadedPaths.map((storagePath) => ({
        storage_path: storagePath,
        status: "pending",
      }));

      const { error: databaseError } = await supabase
        .from("photos")
        .insert(databaseRows);

      if (databaseError) {
        console.error("DATABASE ERROR:", {
          message: databaseError.message,
          details: databaseError.details,
          hint: databaseError.hint,
          code: databaseError.code,
        });

        throw databaseError;
      }

      // --------------------------------------------------
      // BAŞARILI
      // --------------------------------------------------

      setMessage(
        files.length === 1
          ? "Fotoğrafınız bize ulaştı. Onaylandıktan sonra anı galerimizde yerini alacak."
          : `${files.length} fotoğrafınız bize ulaştı. Onaylandıktan sonra anı galerimizde yerlerini alacaklar.`
      );

      // Seçimleri temizle
      setFiles([]);

      previews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });

      setPreviews([]);
    } catch (uploadError) {
      console.error(uploadError);

      // Storage'a yüklenmiş ama DB'ye kaydedilememiş dosyalar varsa temizle
      if (uploadedPaths.length > 0) {
        const { error: cleanupError } = await supabase.storage
          .from("wedding-photos")
          .remove(uploadedPaths);

        if (cleanupError) {
          console.error(
            "STORAGE CLEANUP ERROR:",
            cleanupError
          );
        }
      }

      setMessage("");

      setError(
        "Fotoğraflar yüklenirken bir sorun oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setIsUploading(false);
    }
  };

  // --------------------------------------------------
  // MODALI KAPAT
  // --------------------------------------------------

  const handleClose = () => {
    if (isUploading) return;

    setIsOpen(false);
    setFiles([]);
    setMessage("");
    setError("");

    previews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    setPreviews([]);
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-10 rounded-full border border-[#c9b2a8] bg-[#faf8f3] px-8 py-3 text-sm text-[#6f625a] shadow-[0_8px_25px_rgba(80,65,55,0.06)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f2eee6]"
      >
        Fotoğraf Bırak
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#403a36]/30 px-5 backdrop-blur-sm overscroll-none"
          onTouchMove={(event) => event.stopPropagation()}
          onWheel={(event) => event.stopPropagation()}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto overscroll-contain rounded-[28px] border border-[#e5ded5] bg-[#faf8f3] p-7 shadow-[0_25px_80px_rgba(70,55,45,0.18)] sm:p-9"
            onClick={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
            onWheel={(event) => event.stopPropagation()}
          >
            {/* KAPAT */}
            <button
              type="button"
              onClick={handleClose}
              disabled={isUploading}
              className="absolute right-5 top-5 z-10 text-2xl font-light text-[#9a8c82] transition-colors hover:text-[#6f625a] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Kapat"
            >
              ×
            </button>

            {/* BAŞLIK */}
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[#9a8c82]">
                Güzel bir anı
              </p>

              <h3 className="mt-4 font-serif text-4xl text-[#403a36]">
                Bir anınızı bırakın
              </h3>

              <div className="botanical-divider">
                <span>❦</span>
              </div>

              <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-[#77716b]">
                Bu güzel günden çektiğiniz fotoğrafları
                bizimle paylaşabilirsiniz.
              </p>
            </div>

            {/* =================================================
                FOTOĞRAF SEÇME
            ================================================= */}

            {files.length === 0 && !message && (
              <label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed border-[#d7c8bf] bg-[#f2eee6]/60 px-6 py-12 text-center transition-colors hover:bg-[#f2eee6]">
                <span className="text-3xl text-[#b79d91]">
                  ♡
                </span>

                <span className="mt-4 font-serif text-2xl text-[#6f625a]">
                  Fotoğraf seç
                </span>

                <span className="mt-2 text-xs leading-5 text-[#9a8c82]">
                  Tek veya birden fazla fotoğraf seçebilirsiniz.
                  <br />
                  En fazla 5 fotoğraf · Maksimum 30 MB / fotoğraf
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}

            {/* =================================================
                SEÇİLEN FOTOĞRAFLAR
            ================================================= */}

            {files.length > 0 && !message && (
              <div className="mt-8">
                {/* FOTOĞRAF GRID */}
                <div className="grid grid-cols-2 gap-3">
                  {previews.map((preview, index) => (
                    <div
                      key={preview}
                      className="relative overflow-hidden rounded-[18px] bg-[#eee7df]"
                    >
                      <img
                        src={preview}
                        alt={`Seçilen fotoğraf ${index + 1}`}
                        className="aspect-square w-full object-cover"
                      />

                      <div className="absolute bottom-2 left-2 rounded-full bg-[#403a36]/60 px-2.5 py-1 text-[10px] text-white backdrop-blur-sm">
                        {index + 1} / {files.length}
                      </div>
                    </div>
                  ))}
                </div>

                {/* DOSYA SAYISI */}
                <p className="mt-4 text-center text-xs text-[#9a8c82]">
                  {files.length === 1
                    ? "1 fotoğraf seçildi"
                    : `${files.length} fotoğraf seçildi`}
                </p>

                {/* BUTONLAR */}
                <div className="mt-6 flex gap-3">
                  <label className="flex-1 cursor-pointer rounded-full border border-[#d7c8bf] bg-transparent px-4 py-3 text-center text-sm text-[#6f625a] transition-colors hover:bg-[#f2eee6]">
                    Değiştir

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="flex-1 rounded-full bg-[#b79d91] px-4 py-3 text-sm text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a88d82] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isUploading
                      ? "Gönderiliyor..."
                      : files.length === 1
                        ? "Fotoğrafı Gönder"
                        : `${files.length} Fotoğrafı Gönder`}
                  </button>
                </div>
              </div>
            )}

            {/* =================================================
                BAŞARILI
            ================================================= */}

            {message && (
              <div className="mt-8 rounded-[22px] bg-[#e9eee6] px-6 py-8 text-center">
                <div className="text-3xl text-[#8d9b85]">
                  ♡
                </div>

                <p className="mt-4 font-serif text-2xl text-[#403a36]">
                  {isUploading
                    ? "Fotoğraflar hazırlanıyor"
                    : "Teşekkür ederiz"}
                </p>

                <p className="mt-3 text-sm leading-7 text-[#6f625a]">
                  {message}
                </p>

                {!isUploading && (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-6 rounded-full border border-[#c9b2a8] bg-[#faf8f3] px-7 py-2.5 text-sm text-[#6f625a] transition-colors hover:bg-[#f2eee6]"
                  >
                    Kapat
                  </button>
                )}
              </div>
            )}

            {/* =================================================
                HATA
            ================================================= */}

            {error && (
              <p className="mt-5 text-center text-sm leading-6 text-[#a16f68]">
                {error}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
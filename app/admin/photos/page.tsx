"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Photo = {
  id: number;
  created_at: string;
  storage_path: string;
  status: string;
  signedUrl: string | null;
};

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [approvedPhotos, setApprovedPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const createSignedUrl = async (storagePath: string) => {
    const { data, error } = await supabase.storage
      .from("wedding-photos")
      .createSignedUrl(storagePath, 3600);

    if (error) {
      console.error("SIGNED URL ERROR:", error);
      return null;
    }

    return data.signedUrl;
  };

  const loadPhotos = async () => {
    setIsLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("photos")
      .select("*")
      .in("status", ["pending", "approved"])
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error(fetchError);
      setError("Fotoğraflar yüklenirken bir sorun oluştu.");
      setIsLoading(false);
      return;
    }

    const photosWithUrls = await Promise.all(
      (data ?? []).map(async (photo) => {
        const signedUrl = await createSignedUrl(photo.storage_path);

        return {
          ...photo,
          signedUrl,
        };
      })
    );

    setPhotos(
      photosWithUrls.filter((photo) => photo.status === "pending")
    );

    setApprovedPhotos(
      photosWithUrls.filter((photo) => photo.status === "approved")
    );

    setIsLoading(false);
  };

  const handleApprove = async (photo: Photo) => {
    setActionLoading(photo.id);
    setError("");

    const approvedPath = `approved/${photo.storage_path.replace(
      "pending/",
      ""
    )}`;

    // 1. Pending fotoğrafı approved klasörüne kopyala
    const { error: copyError } = await supabase.storage
      .from("wedding-photos")
      .copy(photo.storage_path, approvedPath);

    if (copyError) {
      console.error("COPY ERROR:", copyError);

      setError(
        `Fotoğraf onaylanamadı: ${copyError.message}`
      );

      setActionLoading(null);
      return;
    }

    // 2. Eski pending dosyasını sil
    const { error: removeError } = await supabase.storage
      .from("wedding-photos")
      .remove([photo.storage_path]);

    if (removeError) {
      console.error("REMOVE ERROR:", removeError);

      setError(
        `Eski fotoğraf silinemedi: ${removeError.message}`
      );

      setActionLoading(null);
      return;
    }

    // 3. Database kaydını approved yap
    const { error: updateError } = await supabase
      .from("photos")
      .update({
        status: "approved",
        storage_path: approvedPath,
      })
      .eq("id", photo.id);

    if (updateError) {
      console.error("UPDATE ERROR:", updateError);

      setError(
        `Fotoğraf kaydı güncellenemedi: ${updateError.message}`
      );

      setActionLoading(null);
      return;
    }

    await loadPhotos();
    setActionLoading(null);
  };

  const handleReject = async (photo: Photo) => {
    const confirmed = window.confirm(
      "Bu fotoğrafı tamamen silmek istediğine emin misin?"
    );

    if (!confirmed) return;

    setActionLoading(photo.id);
    setError("");

    const { error: storageError } = await supabase.storage
      .from("wedding-photos")
      .remove([photo.storage_path]);

    if (storageError) {
      console.error("STORAGE DELETE ERROR:", storageError);

      setError(
        `Fotoğraf silinemedi: ${storageError.message}`
      );

      setActionLoading(null);
      return;
    }

    const { error: databaseError } = await supabase
      .from("photos")
      .delete()
      .eq("id", photo.id);

    if (databaseError) {
      console.error("DATABASE DELETE ERROR:", databaseError);

      setError(
        `Fotoğraf kaydı silinemedi: ${databaseError.message}`
      );

      setActionLoading(null);
      return;
    }

    await loadPhotos();
    setActionLoading(null);
  };

  const handleDeleteApproved = async (photo: Photo) => {
    const confirmed = window.confirm(
      "Bu onaylanmış fotoğrafı galeriden tamamen silmek istediğine emin misin?"
    );

    if (!confirmed) return;

    setActionLoading(photo.id);
    setError("");

    const { error: storageError } = await supabase.storage
      .from("wedding-photos")
      .remove([photo.storage_path]);

    if (storageError) {
      console.error("APPROVED STORAGE DELETE ERROR:", storageError);

      setError(
        `Fotoğraf silinemedi: ${storageError.message}`
      );

      setActionLoading(null);
      return;
    }

    const { error: databaseError } = await supabase
      .from("photos")
      .delete()
      .eq("id", photo.id);

    if (databaseError) {
      console.error("APPROVED DATABASE DELETE ERROR:", databaseError);

      setError(
        `Fotoğraf kaydı silinemedi: ${databaseError.message}`
      );

      setActionLoading(null);
      return;
    }

    await loadPhotos();
    setActionLoading(null);
  };

  return (
    <main className="min-h-screen bg-[#f9f7f2] px-6 py-16 text-[#403a36]">
      <div className="mx-auto max-w-6xl">

        {/* BAŞLIK */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9a8c82]">
            Tuğba & Murat
          </p>

          <h1 className="mt-4 font-serif text-5xl text-[#403a36]">
            Fotoğraf Yönetimi
          </h1>

          <div className="botanical-divider">
            <span>❦</span>
          </div>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#77716b]">
            Gönderilen fotoğrafları buradan onaylayabilir veya
            galeriden kaldırabilirsin.
          </p>
        </div>

        {/* HATA */}
        {error && (
          <div className="mx-auto mt-10 max-w-2xl rounded-[20px] bg-[#f3dfdc] px-6 py-4 text-center">
            <p className="text-sm text-[#a16f68]">
              {error}
            </p>
          </div>
        )}

        {/* YÜKLENİYOR */}
        {isLoading && (
          <div className="mt-16 text-center">
            <p className="text-sm text-[#9a8c82]">
              Fotoğraflar yükleniyor...
            </p>
          </div>
        )}

        {!isLoading && (
          <>
            {/* =========================
                BEKLEYEN FOTOĞRAFLAR
            ========================= */}

            <section className="mt-16">

              <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.25em] text-[#9a8c82]">
                  Onay bekleyenler
                </p>

                <h2 className="mt-2 font-serif text-3xl text-[#403a36]">
                  Bekleyen fotoğraflar
                </h2>
              </div>

              {photos.length === 0 ? (
                <div className="rounded-[24px] border border-[#e5ded5] bg-[#faf8f3] px-6 py-10 text-center">
                  <p className="text-2xl text-[#b79d91]">
                    ♡
                  </p>

                  <p className="mt-3 text-sm text-[#77716b]">
                    Bekleyen fotoğraf yok.
                  </p>
                </div>
              ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="overflow-hidden rounded-[28px] border border-[#e5ded5] bg-[#faf8f3] shadow-[0_15px_40px_rgba(70,55,45,0.08)]"
                    >

                      <div className="aspect-[4/5] overflow-hidden bg-[#eee7df]">
                        {photo.signedUrl && (
                          <img
                            src={photo.signedUrl}
                            alt="Onay bekleyen fotoğraf"
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>

                      <div className="p-6">

                        <p className="text-xs uppercase tracking-[0.2em] text-[#9a8c82]">
                          Bekliyor
                        </p>

                        <p className="mt-2 text-xs text-[#77716b]">
                          {new Date(
                            photo.created_at
                          ).toLocaleString("tr-TR")}
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-3">

                          <button
                            type="button"
                            onClick={() => handleApprove(photo)}
                            disabled={actionLoading === photo.id}
                            className="rounded-full bg-[#8d9b85] px-4 py-2.5 text-sm text-white transition hover:bg-[#7d8b75] disabled:opacity-60"
                          >
                            {actionLoading === photo.id
                              ? "İşleniyor..."
                              : "Onayla"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleReject(photo)}
                            disabled={actionLoading === photo.id}
                            className="rounded-full border border-[#d7c8bf] px-4 py-2.5 text-sm text-[#a16f68] transition hover:bg-[#f2eee6] disabled:opacity-60"
                          >
                            Reddet
                          </button>

                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              )}
            </section>


            {/* =========================
                ONAYLANAN FOTOĞRAFLAR
            ========================= */}

            <section className="mt-24">

              <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.25em] text-[#9a8c82]">
                  Galeride
                </p>

                <h2 className="mt-2 font-serif text-3xl text-[#403a36]">
                  Onaylanan fotoğraflar
                </h2>
              </div>

              {approvedPhotos.length === 0 ? (
                <div className="rounded-[24px] border border-[#e5ded5] bg-[#faf8f3] px-6 py-10 text-center">
                  <p className="text-2xl text-[#b79d91]">
                    ♡
                  </p>

                  <p className="mt-3 text-sm text-[#77716b]">
                    Henüz onaylanan fotoğraf yok.
                  </p>
                </div>
              ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                  {approvedPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="overflow-hidden rounded-[28px] border border-[#e5ded5] bg-[#faf8f3] shadow-[0_15px_40px_rgba(70,55,45,0.08)]"
                    >

                      <div className="aspect-[4/5] overflow-hidden bg-[#eee7df]">
                        {photo.signedUrl && (
                          <img
                            src={photo.signedUrl}
                            alt="Onaylanmış fotoğraf"
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>

                      <div className="p-6">

                        <p className="text-xs uppercase tracking-[0.2em] text-[#8d9b85]">
                          Onaylandı
                        </p>

                        <p className="mt-2 text-xs text-[#77716b]">
                          {new Date(
                            photo.created_at
                          ).toLocaleString("tr-TR")}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteApproved(photo)
                          }
                          disabled={actionLoading === photo.id}
                          className="mt-5 w-full rounded-full border border-[#d7c8bf] px-4 py-2.5 text-sm text-[#a16f68] transition hover:bg-[#f2eee6] disabled:opacity-60"
                        >
                          {actionLoading === photo.id
                            ? "Siliniyor..."
                            : "Galeriden Sil"}
                        </button>

                      </div>
                    </div>
                  ))}

                </div>
              )}

            </section>

          </>
        )}

      </div>
    </main>
  );
}
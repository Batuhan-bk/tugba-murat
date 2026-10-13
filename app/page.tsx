
import Image from "next/image";
import EventEnvelope from "@/components/EventEnvelope";
import BackgroundDecor from "@/components/BackgroundDecor";
import PhotoUpload from "@/components/PhotoUpload";
import PhotoGallery from "@/components/PhotoGallery";
import Countdown from "@/components/Countdown";
import Link from "next/link";

export default function Home() {
  return (
    <main className="paper-texture relative min-h-screen overflow-hidden text-[#403a36]">
      <BackgroundDecor />

      {/* HERO */}
      <section className="soft-section relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
        <div className="hero-glow hero-glow-left" />
        <div className="hero-glow hero-glow-right" />

        <div className="floating-detail absolute left-[8%] top-[22%] hidden text-3xl text-[#a8b2a0]/50 md:block">
          ❧
        </div>

        <div className="floating-detail-slow absolute right-[9%] bottom-[20%] hidden -rotate-12 text-3xl text-[#a8b2a0]/40 md:block">
          ❧
        </div>

        <div className="relative z-10">
          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#9a8c82]">
            Birlikte nice güzel anılara
          </p>

          <h1 className="font-serif text-6xl tracking-tight text-[#403a36] sm:text-8xl">
            Tuğba & Murat
          </h1>

          <div className="botanical-divider">
            <span>❦</span>
          </div>

          <p className="mx-auto mt-7 max-w-md text-sm leading-7 text-[#77716b] sm:text-base">
            Bu özel günümüzde sizleri de aramızda görmekten
            mutluluk duyuyoruz.
          </p>

          {/* HERO FOTOĞRAF */}
          <div className="relative mx-auto mt-14 w-full max-w-[520px]">
            <div className="absolute -inset-5 rounded-[160px] bg-[#e8d3ca]/20 blur-3xl" />

            <div className="relative rounded-[155px] border border-[#d8c8bd]/70 bg-[#f2eee6] p-2 shadow-[0_25px_60px_rgba(80,65,55,0.10)]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[145px]">
                <Image
                  src="/tugba-murat-2.jpg"
                  alt="Tuğba ve Murat"
                  fill
                  priority
                  sizes="(max-width: 640px) 90vw, 520px"
                  className="object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#403a36]/10 via-transparent to-[#fff8f2]/10" />
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 text-xl text-[#b9aa9f]/70">
              ❦
            </div>
          </div>

          {/* TARİH ALANI */}
          <div className="mt-14">
            <p className="mt-3 font-serif text-2xl text-[#403a36] sm:text-3xl">
              Güzel bir gün bizi bekliyor
            </p>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="soft-border relative border-y border-[#e5ded5] bg-[#f2eee6]/45 px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9a8c82]">
            Düğünümüze
          </p>

          <h2 className="mt-4 font-serif text-4xl text-[#403a36] sm:text-5xl">
            Geri sayıyoruz
          </h2>

          <div className="botanical-divider">
            <span>❦</span>
          </div>

          <Countdown />
        </div>
      </section>

      {/* DAVETİYELER */}
      <section className="soft-section relative px-6 py-28">
        <div className="floating-detail-slow pointer-events-none absolute left-[3%] top-[25%] hidden text-5xl text-[#a8b2a0]/15 lg:block">
          ❧
        </div>

        <div className="floating-detail pointer-events-none absolute right-[3%] top-[45%] hidden -rotate-12 text-5xl text-[#a8b2a0]/15 lg:block">
          ❧
        </div>

        <div className="relative z-10 mx-auto max-w-5xl">
          {/* BAŞLIK */}
          <div className="text-center">
            <h2 className="mt-4 font-serif text-5xl text-[#403a36] sm:text-6xl">
              Davetiyelerimiz
            </h2>

            <div className="botanical-divider">
              <span>❦</span>
            </div>

            <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[#77716b]">
              Kına gecemizin ve düğünümüzün detaylarını
              davetiyelerimizi açarak görebilirsiniz.
            </p>
          </div>

          {/* ZARFLAR */}
          <div className="mt-30 flex flex-col items-center justify-center gap-30 md:flex-row md:items-start md:gap-28">
            <EventEnvelope
              title="Kına"
              date="16 Ekim 2026"
              time="Cuma - 19:00"
              location={`TÜTÜNÇİFTLİK KÜLTÜR MERKEZİ
Güney Mh. Adnan Kahveci Cd. No: 6
Körfez / Kocaeli`}
            />

            <EventEnvelope
              title="Düğün"
              date="18 Ekim 2026"
              time="Pazar - 13:00"
              location={`ÖZLEM DÜĞÜN SALONU
Fevzi Çakmak Mh. Mimar Sinan Cd.
Bora Sk. No: 2
Pendik / İstanbul`}
            />
          </div>

          {/* DÜĞÜN GÜNÜ ULAŞIM BİLGİSİ */}
          <div className="mx-auto mt-12 w-full max-w-2xl border-t border-[#dfd0c5] pt-8">
            {/* Üst süsleme */}
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#d8c4b8]" />
              <span className="font-serif text-xl text-[#b38e83]">❦</span>
              <span className="h-px w-12 bg-[#d8c4b8]" />
            </div>

            <h3 className="text-center font-serif text-2xl text-[#66564d] sm:text-3xl">
              Düğün Günü Ulaşım Bilgisi
            </h3>

            <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-[#8d8178]">
              Otobüslerimiz, düğün salonuna ulaşım için belirtilen saatlerde
              hareket edecektir.
            </p>

            {/* EŞİT VE SİMETRİK KARTLAR */}
            <div className="mx-auto mt-7 grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {/* GELİN EVİ */}
              <div className="flex min-h-[165px] flex-col items-center justify-center rounded-2xl border border-[#e6d9d0] bg-white/40 px-5 py-5 text-center shadow-[0_4px_12px_rgba(80,65,55,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(80,65,55,0.08)]">
                <div className="mb-3 flex h-8 items-center justify-center gap-2 text-[#b38e83]">
                  <span className="text-sm">✿</span>
                  <span className="text-2xl">❧</span>
                  <span className="text-sm">✿</span>
                </div>

                <p className="text-xs uppercase tracking-[0.22em] text-[#9a8c82]">
                  Gelin evi
                </p>

                <p className="mt-2 font-serif text-3xl text-[#403a36]">
                  12:00
                </p>

                <p className="mt-1 text-xs tracking-wide text-[#8d8178]">
                  Otobüs hareket saati
                </p>
              </div>

              {/* DAMAT EVİ */}
              <div className="flex min-h-[165px] flex-col items-center justify-center rounded-2xl border border-[#e6d9d0] bg-white/40 px-5 py-5 text-center shadow-[0_4px_12px_rgba(80,65,55,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(80,65,55,0.08)]">
                <div className="mb-3 flex h-8 items-center justify-center gap-2 text-[#b38e83]">
                  <span className="text-sm">✿</span>
                  <span className="text-2xl">❧</span>
                  <span className="text-sm">✿</span>
                </div>

                <p className="text-xs uppercase tracking-[0.22em] text-[#9a8c82]">
                  Damat evi
                </p>

                <p className="mt-2 font-serif text-3xl text-[#403a36]">
                  12:30
                </p>

                <p className="mt-1 text-xs tracking-wide text-[#8d8178]">
                  Otobüs hareket saati
                </p>
              </div>
            </div>

            {/* ALT SÜSLEME */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#e0d1c7]" />
              <span className="text-sm text-[#b38e83]">♡</span>
              <span className="h-px w-8 bg-[#e0d1c7]" />
            </div>
          </div>
        </div>
      </section>

      {/* ANILAR */}
      <section className="relative overflow-hidden bg-[#eee4dd] px-6 py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-20 w-px bg-[#d9c1b7]/60" />

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#927f75]">
            En güzel anılarımız
          </p>

          <h2 className="mt-5 font-serif text-5xl text-[#403a36] sm:text-6xl">
            -Sizde bir anı bırakın-
          </h2>

          <div className="botanical-divider">
            <span>❦</span>
          </div>

          <p className="mx-auto mt-7 max-w-md text-sm leading-7 text-[#6f625a]">
            Bu güzel günümüzden sizin de bir hatıranız olsun.
            Çektiğiniz fotoğrafları bizimle paylaşabilirsiniz.
          </p>

          <PhotoUpload />
          <PhotoGallery />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative overflow-hidden px-6 py-24 text-center">
        <div className="floating-detail pointer-events-none absolute left-[15%] top-[35%] hidden text-4xl text-[#a8b2a0]/20 sm:block">
          ❧
        </div>

        <div className="floating-detail-slow pointer-events-none absolute right-[15%] top-[30%] hidden -rotate-12 text-4xl text-[#a8b2a0]/20 sm:block">
          ❧
        </div>

        <div className="botanical-divider">
          <span>♡</span>
        </div>

        <p className="mt-5 text-md text-[#99918a]">
          Sizi aramızda görmekten mutluluk duyarız.
        </p>

        <Link
          href="/admin/login"
          aria-label="Yönetici girişi"
          className="mt-8 inline-block font-serif text-2xl text-[#b38e83] transition-all duration-300 hover:-translate-y-1 hover:opacity-70"
        >
          ♡
        </Link>
      </footer>
    </main>
  );
}

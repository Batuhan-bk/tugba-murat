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
      

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className=" soft-section relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">

        {/* Arka plandaki yumuşak ışıklar */}
        <div className="hero-glow hero-glow-left" />
        <div className="hero-glow hero-glow-right" />

        {/* Küçük botanik detaylar */}
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

          {/* Fotoğraf alanı */}
          <div className="hero-photo mx-auto mt-14 aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[200px] bg-[#e8e3dc] shadow-[0_20px_50px_rgba(80,65,55,0.08)]">

            {/* Daha sonra gerçek fotoğraf gelecek */}

            <div className="flex h-full items-center justify-center">
              <p className="text-xs uppercase tracking-[0.25em] text-[#a69b92]">
                Fotoğraf
              </p>
            </div>

          </div>

          <div className="mt-14">

            <p className="text-xs uppercase tracking-[0.3em] text-[#a18f86]">
              Çok yakında
            </p>

            <p className="mt-3 font-serif text-2xl text-[#403a36] sm:text-3xl">
              Güzel bir gün bizi bekliyor
            </p>

          </div>

        </div>
      </section>


      {/* =====================================================
          COUNTDOWN
      ===================================================== */}
      
      <section className=" soft-border relative border-y border-[#e5ded5] bg-[#f2eee6]/45 px-6 py-24">

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


      {/* =====================================================
          DAVETİYELER
      ===================================================== */}
      <section className="soft-section relative px-6 py-28">

        {/* Çok hafif arka plan süsleri */}
        <div className="floating-detail-slow pointer-events-none absolute left-[3%] top-[25%] hidden text-5xl text-[#a8b2a0]/15 lg:block">
          ❧
        </div>

        <div className="floating-detail pointer-events-none absolute right-[3%] top-[45%] hidden -rotate-12 text-5xl text-[#a8b2a0]/15 lg:block">
          ❧
        </div>

        <div className="relative z-10 mx-auto max-w-5xl">

          {/* Başlık */}
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


          {/* Zarflar */}
          <div className="mt-30 flex flex-col items-center justify-center gap-30 md:flex-row md:items-start md:gap-28">

            <EventEnvelope
              title="Kına"
              date="16 Ekim 2026"
              time="Cuma - 19:00"
              location={`-TÜTÜNÇİFTLİK KÜLTÜR MERKEZİ-
Güney Mh. Adnan Kahveci Cd. No: 6
Körfez / Kocaeli`}
            />

            <EventEnvelope
              title="Düğün"
              date="18 Ekim 2026"
              time="Pazar - 13:00"
              location={`-ÖZLEM DÜĞÜN SALONU-
Fevzi Çakmak Mh. Mimar Sinan Cd.
Bora Sk. No: 2
Pendik / İstanbul`}
            />

          </div>

        </div>
      </section>


      {/* =====================================================
          ANILAR
      ===================================================== */}
      <section className=" relative overflow-hidden bg-[#eee4dd] px-6 py-28">

        {/* Dekoratif kurdele hissi */}
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

          <p className="mx-auto mt-7 max-w-md text-sm leading-7 text-[#6f625a] ">
            Bu güzel günümüzden sizin de bir hatıranız olsun.
            Çektiğiniz fotoğrafları bizimle paylaşabilirsiniz.
          </p>

       <PhotoUpload />
       <PhotoGallery />

        </div>
      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="relative overflow-hidden px-6 py-24 text-center">

        <div className="floating-detail pointer-events-none absolute left-[15%] top-[35%] hidden text-4xl text-[#a8b2a0]/20 sm:block">
          ❧
        </div>

        <div className="floating-detail-slow pointer-events-none absolute right-[15%] top-[30%] hidden -rotate-12 text-4xl text-[#a8b2a0]/20 sm:block">
          ❧
        </div>

        <p className="font-serif text-4xl text-[#403a36] sm:text-5xl">
          Tuğba & Murat
        </p>

        <div className="botanical-divider">
          <span>♡</span>
        </div>

        <p className="mt-5 text-sm text-[#99918a]">
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
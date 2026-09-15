"use client";

import { useState } from "react";
import { motion } from "motion/react";

type EventEnvelopeProps = {
  title: string;
  date: string;
  time: string;
  location: string;
};

export default function EventEnvelope({
  title,
  date,
  time,
  location,
}: EventEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Adresi Google Maps yol tarifi linkine çevirir
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    location.replace(/\n/g, " ")
  )}`;

  return (
    <div className="flex flex-col items-center">

      {/* ZARF */}
      <div
        className="relative h-[500px] w-[360px]"
        style={{ perspective: "1200px" }}
      >

        {/* Zarfın ana gövdesi */}
        <div className="absolute inset-0 rounded-sm border border-[#d8c8bd] bg-[#f2eee6] shadow-[0_20px_50px_rgba(80,65,55,0.10)]">

          {/* =========================================
              İÇ DAVETİYE KARTI
          ========================================= */}
          <motion.div
            initial={{
              y: 30,
              opacity: 0,
            }}
            animate={{
              y: isOpen ? -150 : 30,
              opacity: isOpen ? 1 : 0,
            }}
            transition={{
              duration: 0.8,
              delay: isOpen ? 0.35 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              absolute
              left-1/2
              top-8
              z-10
              w-[310px]
              min-h-[430px]
              -translate-x-1/2
              rounded-sm
              bg-[#faf8f3]
              px-8
              py-12
              text-center
              shadow-[0_15px_35px_rgba(80,65,55,0.14)]
            "
          >

            {/* Başlık */}
            <p className="text-xs uppercase tracking-[0.25em] text-[#9a8c82]">
              {title}
            </p>

            <div className="mx-auto my-6 h-px w-14 bg-[#d9c6bb]" />

            {/* Tarih */}
            <p className="font-serif text-3xl text-[#403a36]">
              {date}
            </p>

            {/* Information */}
            <p className="mt-3 text-sm text-[#8f857d]">
              {time}
            </p>

            <div className="my-8 h-px bg-[#e5ded5]" />

            {/* Mekan */}
           <p className="whitespace-pre-line text-sm leading-7 text-[#6f625a]">
  {location}
</p>

            {/* Konum */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => {
                event.stopPropagation();
              }}
              className="
                mt-8
                inline-block
                text-xs
                tracking-wider
                text-[#6f625a]
                underline
                underline-offset-4
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:opacity-60
              "
            >
              Konumu Gör
            </a>

          </motion.div>


          {/* =========================================
              ÜST ZARF KAPAĞI
          ========================================= */}
          <motion.div
            className="
              absolute
              inset-x-0
              top-0
              z-30
              h-[240px]
              origin-top
            "
            style={{
              transformStyle: "preserve-3d",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              backgroundColor: "#eee7de",
              borderBottom: "1px solid #d8c8bd",
              backfaceVisibility: "hidden",
            }}
            animate={{
              rotateX: isOpen ? 180 : 0,
            }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          />


          {/* =========================================
              ALT / ÖN ZARF KAPAĞI
          ========================================= */}
          <div
            className="
              absolute
              inset-x-0
              bottom-0
              z-20
              h-[185px]
              bg-[#f2eee6]
            "
            style={{
              clipPath:
                "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)",
            }}
          />


          {/* =========================================
              KURDELE
          ========================================= */}
          <motion.button
            type="button"
            aria-label={`${title} davetiyesini aç`}
            onClick={() => setIsOpen(true)}
            className="
              absolute
              left-1/2
              top-1/2
              z-40
              -translate-x-1/2
              -translate-y-1/2
              cursor-pointer
            "
            animate={{
              scale: isOpen ? 0.7 : 1,
              opacity: isOpen ? 0 : 1,
              y: isOpen ? 20 : 0,
            }}
            transition={{
              duration: 0.35,
            }}
            style={{
              pointerEvents: isOpen ? "none" : "auto",
            }}
          >
            <div
              className="
                relative
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-full
                border
                border-[#d99f91]
                bg-[#e8d3ca]
                shadow-sm
                transition-transform
                hover:scale-105
              "
            >
              <span className="font-serif text-3xl text-[#9a7066]">
                ♡
              </span>
            </div>
          </motion.button>

        </div>
      </div>


      {/* =========================================
          ZARFIN ALTINDAKİ BİLGİLER
      ========================================= */}
      <div className="mt-8 text-center">

        <p className="font-serif text-3xl text-[#403a36]">
          {title}
        </p>

        <p className="mt-2 text-sm text-[#8f857d]">
          {isOpen
            ? "Davetiye açık"
            : "Detayları görmek için tıklayın"}
        </p>


        {/* =========================================
            KAPAT BUTONU
        ========================================= */}
        <motion.button
          type="button"
          onClick={() => setIsOpen(false)}
          initial={{
            opacity: 0,
            y: -5,
          }}
          animate={{
            opacity: isOpen ? 1 : 0,
            y: isOpen ? 0 : -5,
          }}
          transition={{
            duration: 0.3,
          }}
          className="
            mt-5
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-[#d8c8bd]
            px-5
            py-2
            text-xs
            tracking-[0.12em]
            text-[#6f625a]
            transition-colors
            hover:bg-[#eee7de]
          "
          style={{
            pointerEvents: isOpen ? "auto" : "none",
          }}
        >
          <span className="text-base leading-none">
            ×
          </span>

          Kapat
        </motion.button>

      </div>

    </div>
  );
}
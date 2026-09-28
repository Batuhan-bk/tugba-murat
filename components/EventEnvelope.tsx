"use client";

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
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    location.replace(/\n/g, " ")
  )}`;

  return (
    <motion.div
      className="flex flex-col items-center"
      initial="closed"
      whileInView="open"
      viewport={{
        once: true,
        amount: 0.45,
      }}
    >
      <div
        className="relative h-[500px] w-[360px]"
        style={{ perspective: "1200px" }}
      >
        <div className="absolute inset-0 rounded-sm border border-[#d8c8bd] bg-[#f2eee6] shadow-[0_20px_50px_rgba(80,65,55,0.10)]">

          {/* Davetiyenin iç kartı */}
          <motion.div
            variants={{
              closed: {
                y: 30,
                opacity: 0,
              },
              open: {
                y: -150,
                opacity: 1,
              },
            }}
            transition={{
              duration: 0.9,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute left-1/2 top-8 z-10 w-[310px] min-h-[430px] -translate-x-1/2 rounded-sm bg-[#faf8f3] px-8 py-12 text-center shadow-[0_15px_35px_rgba(80,65,55,0.14)]"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-[#9a8c82]">
              {title}
            </p>

            <div className="mx-auto my-6 h-px w-14 bg-[#d9c6bb]" />

            <p className="font-serif text-3xl text-[#403a36]">
              {date}
            </p>

            <p className="mt-3 text-sm text-[#8f857d]">
              {time}
            </p>

            <div className="my-8 h-px bg-[#e5ded5]" />

            <p className="whitespace-pre-line text-sm leading-7 text-[#6f625a]">
              {location}
            </p>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block text-xs tracking-wider text-[#6f625a] underline underline-offset-4 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-60"
            >
              Konumu Gör
            </a>
          </motion.div>

          {/* Üst kapak */}
          <motion.div
            variants={{
              closed: {
                rotateX: 0,
              },
              open: {
                rotateX: 180,
              },
            }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
           className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[240px] origin-top"
            style={{
              transformStyle: "preserve-3d",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              backgroundColor: "#eee7de",
              borderBottom: "1px solid #d8c8bd",
              backfaceVisibility: "hidden",
            }}
          />

          {/* Alt kapak */}
          <div
            className="absolute inset-x-0 bottom-0 z-20 h-[185px] bg-[#f2eee6]"
            style={{
              clipPath:
                "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)",
            }}
          />

          {/* Kalp artık buton değil, dekoratif mühür */}
          <motion.div
            variants={{
              closed: {
                scale: 1,
                opacity: 1,
              },
              open: {
                scale: 0.7,
                opacity: 0,
                y: 20,
              },
            }}
            transition={{
              duration: 0.35,
              delay: 0.15,
            }}
            className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#d99f91] bg-[#e8d3ca] shadow-sm">
              <span className="font-serif text-3xl text-[#9a7066]">
                ♡
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Davetiye başlığı */}
      <motion.div
        variants={{
          closed: {
            opacity: 0.5,
            y: 5,
          },
          open: {
            opacity: 1,
            y: 0,
          },
        }}
        transition={{
          duration: 0.6,
          delay: 0.6,
        }}
        className="mt-8 text-center"
      >
        <p className="font-serif text-3xl text-[#403a36]">
          {title}
        </p>

        <p className="mt-2 text-sm text-[#8f857d]">
          Davetiye
        </p>
      </motion.div>
    </motion.div>
  );
}
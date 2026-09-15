"use client";

import { useEffect, useState } from "react";

const WEDDING_DATE = new Date("2026-10-18T13:00:00+03:00").getTime();

type CountdownValues = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const initialCountdown: CountdownValues = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export default function Countdown() {
  const [countdown, setCountdown] =
    useState<CountdownValues>(initialCountdown);

  useEffect(() => {
    const calculateCountdown = () => {
      const now = Date.now();
      const difference = WEDDING_DATE - now;

      if (difference <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      const totalSeconds = Math.floor(difference / 1000);

      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor(
        (totalSeconds % (60 * 60 * 24)) / (60 * 60)
      );
      const minutes = Math.floor(
        (totalSeconds % (60 * 60)) / 60
      );
      const seconds = totalSeconds % 60;

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
      });
    };

    calculateCountdown();

    const interval = setInterval(calculateCountdown, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const items = [
    {
      value: countdown.days,
      label: "Gün",
    },
    {
      value: countdown.hours,
      label: "Saat",
    },
    {
      value: countdown.minutes,
      label: "Dakika",
    },
    {
      value: countdown.seconds,
      label: "Saniye",
    },
  ];

  return (
    <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-y-0">
      {items.map((item) => (
        <div
          key={item.label}
          className="countdown-item"
        >
          <p className="font-serif text-5xl text-[#403a36] sm:text-6xl">
            {String(item.value).padStart(2, "0")}
          </p>

          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#9a8c82]">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
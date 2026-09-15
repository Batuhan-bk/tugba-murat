"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("E-posta veya şifre hatalı.");
      setIsLoading(false);
      return;
    }

    router.replace("/admin/photos");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f9f7f2] px-6 text-[#403a36]">
      <div className="w-full max-w-md rounded-[28px] border border-[#e5ded5] bg-[#faf8f3] p-8 shadow-[0_20px_60px_rgba(70,55,45,0.10)] sm:p-10">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9a8c82]">
            Tuğba & Murat
          </p>

          <h1 className="mt-4 font-serif text-4xl">
            Yönetici Girişi
          </h1>

          <div className="botanical-divider">
            <span>❦</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-[#6f625a]">
              E-posta
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-2xl border border-[#d8c8bd] bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-[#b79d91]"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#6f625a]">
              Şifre
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-2xl border border-[#d8c8bd] bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-[#b79d91]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-2xl bg-[#f3dfdc] px-4 py-3 text-center text-sm text-[#a16f68]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-[#6f625a] px-6 py-3 text-sm text-white transition hover:bg-[#5f544d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </main>
  );
}
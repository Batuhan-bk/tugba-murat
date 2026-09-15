"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setError("");

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    console.log("LOGIN RESULT:", loginError);

    if (loginError) {
      setError("E-posta veya şifre hatalı.");
      setIsLoading(false);
      return;
    }

    router.push("/admin/photos");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f9f7f2] px-6">
      <div className="w-full max-w-md rounded-[28px] border border-[#e5ded5] bg-[#faf8f3] p-8 shadow-[0_25px_80px_rgba(70,55,45,0.12)] sm:p-10">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9a8c82]">
            Tuğba & Murat
          </p>

          <h1 className="mt-4 font-serif text-4xl text-[#403a36]">
            Yönetim Paneli
          </h1>

          <div className="botanical-divider">
            <span>❦</span>
          </div>

          <p className="mt-5 text-sm leading-7 text-[#77716b]">
            Fotoğrafları yönetmek için giriş yapın.
          </p>
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
              className="w-full rounded-2xl border border-[#d7c8bf] bg-white/60 px-4 py-3 text-sm text-[#403a36] outline-none transition focus:border-[#b79d91]"
              placeholder="admin@email.com"
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
              className="w-full rounded-2xl border border-[#d7c8bf] bg-white/60 px-4 py-3 text-sm text-[#403a36] outline-none transition focus:border-[#b79d91]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-center text-sm text-[#a16f68]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-[#b79d91] px-6 py-3 text-sm text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a88d82] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </main>
  );
}
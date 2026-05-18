"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }

      router.push("/chats");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            placeholder="Your name"
            className="w-full px-3 py-2 text-sm text-stone-900 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-stone-400 transition-colors placeholder:text-stone-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2 text-sm text-stone-900 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-stone-400 transition-colors placeholder:text-stone-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full px-3 py-2 text-sm text-stone-900 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-stone-400 transition-colors placeholder:text-stone-400"
          />
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 text-sm font-medium text-white rounded-lg transition-opacity disabled:opacity-50"
        style={{ backgroundColor: "#4a6741" }}
      >
        {loading ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-stone-500">
        Already have an account?{" "}
        <Link href="/login" className="text-stone-900 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

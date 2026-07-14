"use client";

import { useState } from "react";

interface UserAuthModalProps {
  onClose: () => void;
  onLogin: (user: UserData) => void;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  walletBalance: number;
}

export default function UserAuthModal({ onClose, onLogin }: UserAuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.error || "فشل تسجيل الدخول");
      }
    } catch {
      setError("حدث خطأ في الاتصال");
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Auto login after register
        const loginRes = await fetch("/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const loginData = await loginRes.json();
        
        if (loginData.success) {
          localStorage.setItem("userToken", loginData.token);
          localStorage.setItem("userData", JSON.stringify(loginData.user));
          onLogin(loginData.user);
        }
      } else {
        setError(data.error || "فشل إنشاء الحساب");
      }
    } catch {
      setError("حدث خطأ في الاتصال");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-dark-card rounded-2xl shadow-2xl border border-primary/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                mode === "login"
                  ? "bg-primary text-white"
                  : "bg-dark-surface text-gray-400 hover:text-white"
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                mode === "register"
                  ? "bg-primary text-white"
                  : "bg-dark-surface text-gray-400 hover:text-white"
              }`}
            >
              حساب جديد
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">كلمة المرور</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold disabled:opacity-50"
              >
                {loading ? "جاري الدخول..." : "تسجيل الدخول"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  placeholder="أحمد محمد"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">رقم الهاتف (اختياري)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  placeholder="01xxxxxxxxx"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">كلمة المرور</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  placeholder="6 أحرف على الأقل"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  placeholder="أعد كتابة كلمة المرور"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold disabled:opacity-50"
              >
                {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
              </button>
            </form>
          )}

          {/* Benefits */}
          <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <h5 className="font-bold text-white text-sm mb-2">مميزات الحساب:</h5>
            <ul className="text-xs text-gray-400 space-y-1">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                محفظة رقمية لسهولة الدفع
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                تتبع الطلبات والمشتريات
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                عروض حصرية للأعضاء
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        onLogin();
      } else {
        setError(data.error || "كلمة المرور غير صحيحة");
      }
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark hero-gradient px-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-primary to-accent mb-4">
              <img src="/images/logo.png" alt="Apex Athletics" className="w-20 h-20 rounded-2xl" />
            </div>
            <h2 className="text-2xl font-bold gradient-text">لوحة التحكم</h2>
            <p className="text-gray-400 text-sm mt-2">ادخل كلمة المرور للوصول</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
            >
              {loading ? "جاري التحقق..." : "تسجيل الدخول"}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full py-3 border border-primary/30 text-gray-300 rounded-xl font-bold hover:bg-primary/10 transition-all"
            >
              العودة للموقع
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

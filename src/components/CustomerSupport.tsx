"use client";

import { useState } from "react";

const SUPPORT_PHONE = "01229938115";
const WHATSAPP_NUMBER = "201229938115";

export default function CustomerSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setFeedback(data.message || "تم إرسال طلبك بنجاح");
        setForm({ name: "", phone: "", email: "", message: "" });
      } else {
        setFeedback(data.error || "فشل في إرسال الطلب");
      }
    } catch {
      setFeedback("حدث خطأ في الاتصال، حاول مرة أخرى");
    }

    setSubmitting(false);
  };

  return (
    <>
      {/* Support Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        aria-label="خدمة العملاء"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          </>
        )}
      </button>

      {/* Options Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-72 bg-dark-card rounded-2xl shadow-2xl border border-primary/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
            <h3 className="font-bold text-white text-lg">خدمة العملاء</h3>
            <p className="text-sm text-white/80">نحن هنا لمساعدتك 24/7</p>
          </div>

          {/* Options */}
          <div className="p-4 space-y-2">
            <form onSubmit={handleSubmit} className="space-y-2 border-b border-primary/10 pb-3">
              <input
                type="text"
                required
                placeholder="الاسم"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-dark-surface border border-primary/20 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500"
              />
              <input
                type="tel"
                placeholder="رقم الهاتف"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-dark-surface border border-primary/20 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500"
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-dark-surface border border-primary/20 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500"
              />
              <textarea
                required
                rows={3}
                placeholder="اكتب استفسارك أو مشكلتك"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-dark-surface border border-primary/20 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500"
              />
              {feedback && <p className="text-xs text-green-400">{feedback}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-sm disabled:opacity-50"
              >
                {submitting ? "جاري الإرسال..." : "إرسال طلب الدعم"}
              </button>
            </form>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("مرحباً، أحتاج مساعدة من فريق Apex Athletics")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3 rounded-xl bg-dark-surface hover:bg-green-500/10 transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-xl shrink-0">
                💬
              </div>
              <div className="text-right flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm">واتساب</h4>
                <p className="text-xs text-gray-400">محادثة فورية</p>
              </div>
              <svg className="w-5 h-5 text-gray-500 group-hover:text-green-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            {/* Call */}
            <a
              href={`tel:${SUPPORT_PHONE}`}
              className="w-full p-3 rounded-xl bg-dark-surface hover:bg-blue-500/10 transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-xl shrink-0">
                📞
              </div>
              <div className="text-right flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm">اتصال مباشر</h4>
                <p className="text-xs text-gray-400">{SUPPORT_PHONE}</p>
              </div>
              <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>

            {/* SMS */}
            <a
              href={`sms:${SUPPORT_PHONE}`}
              className="w-full p-3 rounded-xl bg-dark-surface hover:bg-purple-500/10 transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-xl shrink-0">
                💌
              </div>
              <div className="text-right flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm">رسالة نصية</h4>
                <p className="text-xs text-gray-400">أرسل SMS</p>
              </div>
              <svg className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>

            {/* Email */}
            <a
              href="mailto:support@apexathletics.com?subject=استفسار من الموقع"
              className="w-full p-3 rounded-xl bg-dark-surface hover:bg-red-500/10 transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-xl shrink-0">
                📧
              </div>
              <div className="text-right flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm">بريد إلكتروني</h4>
                <p className="text-xs text-gray-400 truncate">support@apexathletics.com</p>
              </div>
              <svg className="w-5 h-5 text-gray-500 group-hover:text-red-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
          </div>

          {/* Quick WhatsApp Button */}
          <div className="p-4 border-t border-primary/10">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("مرحباً، أحتاج مساعدة")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all block text-center"
            >
              <span>💬</span>
              تواصل عبر واتساب الآن
            </a>
          </div>
        </div>
      )}
    </>
  );
}

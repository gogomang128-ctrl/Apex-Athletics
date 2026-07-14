"use client";

import { useState } from "react";
import type { CartItem } from "./ClientHome";
import type { UserData } from "./UserAuthModal";
import PaymentModal from "./PaymentModal";

interface CheckoutModalProps {
  cart: CartItem[];
  total: number;
  onClose: () => void;
  onSuccess: () => void;
  user: UserData | null;
}

export default function CheckoutModal({ cart, total, onClose, onSuccess, user }: CheckoutModalProps) {
  const [form, setForm] = useState({
    customerName: user?.name || "",
    customerEmail: user?.email || "",
    customerPhone: user?.phone || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [showPayment, setShowPayment] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderItems = cart.map(item => ({
        id: item.product.id,
        name: item.product.nameAr,
        price: item.product.price,
        quantity: item.quantity,
      }));

      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: orderItems,
          totalAmount: total,
        }),
      });

      setShowPayment(true);
    } catch {
      /* ignore */
    }
    setSubmitting(false);
  };

  if (showPayment) {
    return (
      <PaymentModal
        total={total}
        onClose={onClose}
        onSuccess={onSuccess}
        userId={user?.id}
        walletBalance={user?.walletBalance || 0}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg glass-card rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold gradient-text">إتمام الطلب</h3>
          <button onClick={onClose} className="p-2 hover:bg-dark-surface rounded-xl">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary-light" : "text-gray-500"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? "bg-primary" : "bg-dark-surface"}`}>1</div>
            <span className="text-sm font-bold">المراجعة</span>
          </div>
          <div className="flex-1 h-0.5 bg-dark-surface">
            <div className={`h-full bg-primary transition-all ${step >= 2 ? "w-full" : "w-0"}`} />
          </div>
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary-light" : "text-gray-500"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? "bg-primary" : "bg-dark-surface"}`}>2</div>
            <span className="text-sm font-bold">البيانات</span>
          </div>
        </div>

        {step === 1 && (
          <div>
            <div className="space-y-3 mb-6">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-3 p-3 bg-dark-surface rounded-xl">
                  <img src={item.product.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">{item.product.nameAr}</h4>
                    <p className="text-xs text-gray-400">الكمية: {item.quantity}</p>
                  </div>
                  <span className="font-bold gradient-text">${item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center p-4 bg-primary/10 rounded-xl mb-4">
              <span className="font-bold text-white">المجموع الكلي</span>
              <span className="text-2xl font-black gradient-text">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold text-lg"
            >
              التالي
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">الاسم الكامل</label>
              <input
                type="text"
                required
                value={form.customerName}
                onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                placeholder="أدخل اسمك"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={form.customerEmail}
                onChange={e => setForm(f => ({ ...f, customerEmail: e.target.value }))}
                className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                placeholder="example@email.com"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">رقم الهاتف</label>
              <input
                type="tel"
                required
                value={form.customerPhone}
                onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))}
                className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                placeholder="01xxxxxxxxx"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-primary/30 text-gray-300 rounded-xl font-bold hover:bg-primary/10"
              >
                رجوع
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold disabled:opacity-50"
              >
                {submitting ? "جاري الإرسال..." : "متابعة للدفع"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

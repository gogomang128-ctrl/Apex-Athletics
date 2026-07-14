"use client";

import { useState } from "react";

interface PaymentModalProps {
  total: number;
  onClose: () => void;
  onSuccess: () => void;
  userId?: string;
  walletBalance?: number;
}

export default function PaymentModal({ total, onClose, onSuccess, userId, walletBalance = 0 }: PaymentModalProps) {
  const [method, setMethod] = useState<"instapay" | "wallet">("instapay");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [transactionRef, setTransactionRef] = useState("");
  const [processing, setProcessing] = useState(false);

  const INSTAPAY_NUMBER = "01229938115";
  const canUseWallet = walletBalance >= total;

  const handlePayment = async () => {
    setProcessing(true);

    if (method === "wallet" && userId) {
      // Deduct from wallet
      try {
        const res = await fetch("/api/users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            amount: total,
            type: "purchase",
            description: `شراء منتجات بقيمة $${total}`,
          }),
        });

        if (res.ok) {
          setStep(3);
          setTimeout(() => onSuccess(), 2000);
        } else {
          alert("حدث خطأ في الخصم من المحفظة");
        }
      } catch {
        alert("حدث خطأ");
      }
    } else {
      // InstaPay - just record the order
      setStep(3);
      
      // Track payment request
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          event: "instapay_payment_request", 
          data: { total, transactionRef } 
        }),
      }).catch(() => {});

      setTimeout(() => onSuccess(), 2000);
    }

    setProcessing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("تم النسخ!");
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-dark-card rounded-2xl shadow-2xl border border-primary/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">إتمام الدفع</h3>
            <p className="text-sm text-white/80">المبلغ: ${total.toFixed(2)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Choose Method */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-bold text-white mb-3">اختر طريقة الدفع</h4>
              
              {/* InstaPay */}
              <button
                onClick={() => setMethod("instapay")}
                className={`w-full p-4 rounded-xl border-2 text-right transition-all flex items-center gap-4 ${
                  method === "instapay"
                    ? "border-primary bg-primary/10"
                    : "border-primary/20 hover:border-primary/50"
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl">
                  💳
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-white">انستا باي - InstaPay</h5>
                  <p className="text-xs text-gray-400">تحويل فوري عبر انستا باي</p>
                </div>
              </button>

              {/* Wallet */}
              {userId && (
                <button
                  onClick={() => canUseWallet && setMethod("wallet")}
                  disabled={!canUseWallet}
                  className={`w-full p-4 rounded-xl border-2 text-right transition-all flex items-center gap-4 ${
                    method === "wallet" && canUseWallet
                      ? "border-primary bg-primary/10"
                      : !canUseWallet
                      ? "border-gray-600 opacity-50 cursor-not-allowed"
                      : "border-primary/20 hover:border-primary/50"
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-2xl">
                    👛
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-white">المحفظة</h5>
                    <p className="text-xs text-gray-400">
                      رصيدك: <span className={canUseWallet ? "text-green-400" : "text-red-400"}>${walletBalance.toFixed(2)}</span>
                      {!canUseWallet && " (رصيد غير كافي)"}
                    </p>
                  </div>
                </button>
              )}

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold mt-4"
              >
                التالي
              </button>
            </div>
          )}

          {/* Step 2: Payment Details */}
          {step === 2 && (
            <div className="space-y-4">
              {method === "instapay" ? (
                <>
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-4xl mb-3">
                      💳
                    </div>
                    <h4 className="font-bold text-white text-lg">الدفع عبر انستا باي</h4>
                  </div>

                  <div className="bg-dark-surface rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">رقم انستا باي:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-lg">{INSTAPAY_NUMBER}</span>
                        <button
                          onClick={() => copyToClipboard(INSTAPAY_NUMBER)}
                          className="p-1.5 bg-primary/20 rounded-lg hover:bg-primary/30"
                        >
                          <svg className="w-4 h-4 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">المبلغ المطلوب:</span>
                      <span className="text-2xl font-black gradient-text">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">الاسم:</span>
                      <span className="text-white font-bold">Apex Athletics</span>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <h5 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                      <span>⚠️</span> خطوات الدفع
                    </h5>
                    <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                      <li>افتح تطبيق البنك الخاص بك</li>
                      <li>اختر تحويل انستا باي</li>
                      <li>أدخل الرقم: {INSTAPAY_NUMBER}</li>
                      <li>أدخل المبلغ: ${total.toFixed(2)}</li>
                      <li>أكمل التحويل واحتفظ برقم المرجع</li>
                    </ol>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">رقم مرجع التحويل (اختياري)</label>
                    <input
                      type="text"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="أدخل رقم المرجع بعد التحويل"
                      className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    />
                  </div>

                  <p className="text-xs text-center text-gray-400">
                    بعد التحويل، سيتم تأكيد الطلب خلال دقائق
                  </p>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-4xl mb-4">
                    👛
                  </div>
                  <h4 className="font-bold text-white text-lg mb-2">الدفع من المحفظة</h4>
                  <p className="text-gray-400 mb-4">سيتم خصم ${total.toFixed(2)} من رصيد محفظتك</p>
                  <div className="bg-dark-surface rounded-xl p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">رصيدك الحالي:</span>
                      <span className="text-green-400 font-bold">${walletBalance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">بعد الخصم:</span>
                      <span className="text-white font-bold">${(walletBalance - total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-primary/30 text-gray-300 rounded-xl font-bold hover:bg-primary/10"
                >
                  رجوع
                </button>
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="flex-1 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold disabled:opacity-50"
                >
                  {processing ? "جاري المعالجة..." : "تأكيد الدفع"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">
                {method === "wallet" ? "تم الدفع بنجاح! 🎉" : "تم استلام طلبك! 🎉"}
              </h4>
              <p className="text-gray-400 mb-4">
                {method === "wallet" 
                  ? "تم خصم المبلغ من محفظتك"
                  : "سيتم تأكيد الطلب بعد التحقق من التحويل"}
              </p>
              <p className="text-sm text-gray-500">شكراً لثقتك في Apex Athletics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

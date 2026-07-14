"use client";

import { useState, useEffect } from "react";
import type { UserData } from "./UserAuthModal";

interface WalletTransaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

interface UserWalletPanelProps {
  user: UserData;
  onClose: () => void;
  onRefresh: () => void;
}

export default function UserWalletPanel({ user, onClose, onRefresh }: UserWalletPanelProps) {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [user.id]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`/api/users/${user.id}`);
      const data = await res.json();
      if (data.transactions) {
        setTransactions(data.transactions);
      }
      onRefresh();
    } catch {
      // ignore
    }
    setLoading(false);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "deposit": return { label: "إيداع", color: "text-green-400", icon: "↓" };
      case "withdraw": return { label: "سحب", color: "text-red-400", icon: "↑" };
      case "purchase": return { label: "شراء", color: "text-orange-400", icon: "🛒" };
      default: return { label: type, color: "text-gray-400", icon: "•" };
    }
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-dark-card rounded-2xl shadow-2xl border border-primary/20 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{user.name}</h3>
                <p className="text-sm text-white/80">{user.email}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Wallet Balance */}
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-sm text-white/80 mb-1">رصيد المحفظة</p>
            <p className="text-3xl font-black text-white">${user.walletBalance.toFixed(2)}</p>
          </div>
        </div>

        <div className="p-5">
          {/* Info */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-5">
            <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <span>💡</span> كيف تشحن محفظتك؟
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              قم بتحويل المبلغ المطلوب عبر انستا باي إلى الرقم <span className="text-primary-light font-bold">01229938115</span> 
              ثم تواصل مع خدمة العملاء لتأكيد الإيداع في محفظتك.
            </p>
          </div>

          {/* Transactions */}
          <h4 className="font-bold text-white mb-3 flex items-center gap-2">
            <span>📋</span> سجل المعاملات
          </h4>

          {loading ? (
            <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-gray-500 text-sm">لا توجد معاملات بعد</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => {
                const typeInfo = getTypeLabel(tx.type);
                return (
                  <div key={tx.id} className="flex items-center gap-3 p-3 bg-dark-surface rounded-xl">
                    <div className={`w-8 h-8 rounded-lg bg-dark-card flex items-center justify-center ${typeInfo.color}`}>
                      {typeInfo.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{typeInfo.label}</span>
                        <span className={`font-bold ${tx.type === "deposit" ? "text-green-400" : "text-red-400"}`}>
                          {tx.type === "deposit" ? "+" : "-"}${tx.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{tx.description || "-"}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(tx.createdAt).toLocaleDateString("ar-EG")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

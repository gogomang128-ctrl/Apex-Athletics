"use client";

import type { CartItem } from "./ClientHome";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  total: number;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, cart, onRemove, onUpdateQuantity, total, onCheckout }: CartDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute top-0 left-0 h-full w-full max-w-md bg-dark-card border-r border-primary/20 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl">
              <svg className="w-6 h-6 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">سلة المشتريات</h3>
              <p className="text-xs text-gray-400">{cart.length} منتج</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-dark-surface rounded-xl transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h4 className="text-lg font-bold text-gray-400">السلة فارغة</h4>
              <p className="text-sm text-gray-500 mt-2">أضف بعض المنتجات للبدء</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="glass-card rounded-xl p-4 flex gap-4">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.nameAr}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">{item.product.nameAr}</h4>
                  <p className="text-xs text-accent">{item.product.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-black gradient-text">${item.product.price}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-dark-surface flex items-center justify-center text-white hover:bg-primary/20"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold text-white w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-dark-surface flex items-center justify-center text-white hover:bg-primary/20"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(item.product.id)}
                    className="text-xs text-red-400 hover:text-red-300 mt-1"
                  >
                    إزالة
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-primary/20 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">المجموع</span>
              <span className="text-2xl font-black gradient-text">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              إتمام الشراء
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

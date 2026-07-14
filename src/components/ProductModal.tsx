"use client";

import type { Product } from "./ClientHome";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

export default function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  let features: string[] = [];
  try {
    features = JSON.parse(product.features);
  } catch {
    features = [];
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl glass-card rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Image */}
        <div className="relative h-64 sm:h-80">
          <img
            src={product.imageUrl}
            alt={product.nameAr}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 glass-card rounded-xl hover:bg-dark-surface"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {product.badge && (
            <span className="absolute top-4 right-4 px-4 py-1.5 bg-gradient-to-r from-primary to-accent text-white text-sm font-bold rounded-full">
              {product.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-black text-white mb-1">{product.nameAr}</h2>
          <p className="text-accent text-sm mb-4">{product.name}</p>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <svg key={star} className={`w-5 h-5 ${star <= (product.rating || 5) ? "text-gold" : "text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-400">({product.reviewCount} تقييم)</span>
          </div>

          {/* Description */}
          <p className="text-gray-300 leading-relaxed mb-6">{product.descriptionAr}</p>

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-bold text-white mb-3">✨ المميزات</h3>
            <div className="grid grid-cols-2 gap-2">
              {features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-sm text-gray-300">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between p-4 bg-dark-surface rounded-xl">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black gradient-text">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>
              {product.discount && product.discount > 0 && (
                <span className="text-sm text-green-400 font-bold">وفر {product.discount}%</span>
              )}
            </div>
            <button
              onClick={() => { onAddToCart(product); onClose(); }}
              className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-105"
            >
              أضف للسلة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

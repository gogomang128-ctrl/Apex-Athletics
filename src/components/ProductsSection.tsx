"use client";

import type { Product } from "./ClientHome";

interface ProductsSectionProps {
  products: Product[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  onAddToCart: (p: Product) => void;
  onProductClick: (p: Product) => void;
}

const categories = [
  { id: "all", label: "الكل", icon: "🏠" },
  { id: "healthcare", label: "الرعاية الصحية", icon: "🏥" },
  { id: "fitness", label: "اللياقة", icon: "💪" },
  { id: "retail", label: "التجزئة", icon: "🛒" },
  { id: "automotive", label: "السيارات", icon: "🚗" },
  { id: "enterprise", label: "الشركات", icon: "🏢" },
  { id: "hospitality", label: "الضيافة", icon: "🍽️" },
  { id: "education", label: "التعليم", icon: "🎓" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <svg key={star} className={`w-4 h-4 ${star <= rating ? "text-gold" : "text-gray-600"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductsSection({ products, selectedCategory, onCategoryChange, onAddToCart, onProductClick }: ProductsSectionProps) {
  return (
    <section id="products" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-5xl font-black mb-4">
          <span className="gradient-text">أنظمتنا البرمجية</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          اكتشف مجموعة واسعة من الأنظمة البرمجية المصممة خصيصاً لتلبية احتياجات عملك
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              selectedCategory === cat.id
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30"
                : "glass-card text-gray-300 hover:bg-primary/10"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, idx) => {
          let features: string[] = [];
          try {
            features = JSON.parse(product.features);
          } catch {
            features = [];
          }

          return (
            <div
              key={product.id}
              className="product-card glass-card rounded-2xl overflow-hidden group cursor-pointer"
              
              onClick={() => onProductClick(product)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.nameAr}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card/90 to-transparent" />
                
                {product.badge && (
                  <span className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold rounded-full">
                    {product.badge}
                  </span>
                )}

                {product.discount && product.discount > 0 && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    خصم {product.discount}%
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-1">{product.nameAr}</h3>
                <p className="text-xs text-accent mb-3">{product.name}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={product.rating || 5} />
                  <span className="text-xs text-gray-400">({product.reviewCount})</span>
                </div>

                {/* Features Preview */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {features.slice(0, 3).map((feat, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 bg-primary/10 text-primary-light rounded-full border border-primary/20">
                      {feat}
                    </span>
                  ))}
                  {features.length > 3 && (
                    <span className="text-[10px] px-2 py-1 bg-dark-surface text-gray-400 rounded-full">
                      +{features.length - 3}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black gradient-text">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through mr-2">${product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                    className="p-3 bg-gradient-to-r from-primary to-accent rounded-xl text-white hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-400">لا توجد منتجات مطابقة</h3>
          <p className="text-gray-500 mt-2">جرب البحث بكلمات مختلفة</p>
        </div>
      )}
    </section>
  );
}

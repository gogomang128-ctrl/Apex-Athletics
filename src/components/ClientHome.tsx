"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ProductsSection from "./ProductsSection";
import CartDrawer from "./CartDrawer";
import Footer from "./Footer";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";
import CheckoutModal from "./CheckoutModal";
import ProductModal from "./ProductModal";
import ChatBot from "./ChatBot";
import CustomerSupport from "./CustomerSupport";
import UserAuthModal, { type UserData } from "./UserAuthModal";
import UserWalletPanel from "./UserWalletPanel";

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  category: string;
  imageUrl: string;
  features: string;
  badge: string | null;
  inStock: boolean | null;
  rating: number | null;
  reviewCount: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export default function ClientHome({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [notification, setNotification] = useState<string | null>(null);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  
  // User state
  const [user, setUser] = useState<UserData | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWalletPanel, setShowWalletPanel] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    const savedCart = localStorage.getItem("apexCart");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("userData");
        localStorage.removeItem("userToken");
      }
    }

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem("apexCart");
      }
    }

    fetch("/api/settings")
      .then(r => r.json())
      .then(data => setSiteSettings(data || {}))
      .catch(() => {});

    if (products.length === 0) {
      fetch("/api/seed").then(() => {
        fetch("/api/products")
          .then(r => r.json())
          .then(data => { if (Array.isArray(data)) setProducts(data); });
      });
    }
    
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "page_view", data: { page: "home" } }),
    }).catch(() => {});
  }, [products.length]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("apexCart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("apexCart");
    }
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
    }
  }, [user]);

  const refreshUserData = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/users/${user.id}`);
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem("userData", JSON.stringify(data.user));
      }
    } catch {
      // ignore
    }
  }, [user]);

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showNotification(`تمت إضافة ${product.nameAr} إلى السلة`);
  }, [showNotification]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  }, [removeFromCart]);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("userToken");
    showNotification("تم تسجيل الخروج");
  }, [showNotification]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const refreshProducts = useCallback(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setProducts(data); });
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameAr.includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (adminMode && !adminLoggedIn) {
    return <AdminLogin onLogin={() => setAdminLoggedIn(true)} onBack={() => setAdminMode(false)} />;
  }

  if (adminMode && adminLoggedIn) {
    return (
      <AdminPanel
        products={products}
        onRefresh={refreshProducts}
        onLogout={() => { setAdminMode(false); setAdminLoggedIn(false); }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl shadow-2xl animate-slide-up font-bold">
          {notification}
        </div>
      )}

      <Navbar
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onAdminClick={() => setAdminMode(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        user={user}
        onUserClick={() => user ? setShowWalletPanel(true) : setShowAuthModal(true)}
        onLogout={handleLogout}
        siteSettings={siteSettings}
      />

      <HeroSection siteSettings={siteSettings} />

      <ProductsSection
        products={filteredProducts}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onAddToCart={addToCart}
        onProductClick={setSelectedProduct}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        total={cartTotal}
        onCheckout={() => { setCartOpen(false); setShowCheckout(true); }}
      />

      {showCheckout && (
        <CheckoutModal
          cart={cart}
          total={cartTotal}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setCart([]);
            setShowCheckout(false);
            showNotification("تم إرسال طلبك بنجاح! سنتواصل معك قريباً");
            refreshUserData();
          }}
          user={user}
        />
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {showAuthModal && (
        <UserAuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={(userData) => {
            setUser(userData);
            setShowAuthModal(false);
            showNotification(`مرحباً ${userData.name}!`);
          }}
        />
      )}

      {showWalletPanel && user && (
        <UserWalletPanel
          user={user}
          onClose={() => setShowWalletPanel(false)}
          onRefresh={refreshUserData}
        />
      )}

      <Footer onAdminClick={() => setAdminMode(true)} siteSettings={siteSettings} />
      
      <CustomerSupport />
      <ChatBot />
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product } from "./ClientHome";

interface AdminPanelProps {
  products: Product[];
  onRefresh: () => void;
  onLogout: () => void;
}

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  completedOrders: number;
  monthlyRevenue: { month: string; revenue: number }[];
  categoryDistribution: { category: string; count: number }[];
  recentOrders: { id: string; customerName: string; totalAmount: number; status: string; createdAt: string }[];
  recentEvents: { id: string; event: string; data: string; createdAt: string }[];
}

interface OrderItem {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: string;
  totalAmount: number;
  status: string | null;
  createdAt: Date | null;
}

type AdminTab = "dashboard" | "products" | "orders" | "customers" | "media" | "settings" | "plans";

interface UserItem {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  walletBalance: number | null;
  createdAt: Date | null;
}

export default function AdminPanel({ products, onRefresh, onLogout }: AdminPanelProps) {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [ordersList, setOrdersList] = useState<OrderItem[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const [usersList, setUsersList] = useState<UserItem[]>([]);

  useEffect(() => {
    fetchAnalytics();
    fetchOrders();
    fetchSettings();
    fetchUsers();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics");
      const data = await res.json();
      setAnalyticsData(data);
    } catch {
      /* ignore */
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (Array.isArray(data)) setOrdersList(data);
    } catch {
      /* ignore */
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSiteSettings(data);
    } catch {
      /* ignore */
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (Array.isArray(data)) setUsersList(data);
    } catch {
      /* ignore */
    }
  };

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: "dashboard", label: "لوحة التحليلات", icon: "📊" },
    { id: "products", label: "المنتجات", icon: "📦" },
    { id: "orders", label: "الطلبات", icon: "🛍️" },
    { id: "customers", label: "العملاء والمحافظ", icon: "👥" },
    { id: "media", label: "صور الموقع", icon: "🖼️" },
    { id: "settings", label: "إعدادات الموقع", icon: "⚙️" },
    { id: "plans", label: "الخطط المستقبلية", icon: "🚀" },
  ];

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-card border-l border-primary/20 p-4 flex flex-col min-h-screen fixed right-0 top-0 z-40">
        <div className="flex items-center gap-3 mb-8 p-3">
          <img src="/images/logo.png" alt="Logo" className="w-10 h-10 rounded-lg" />
          <div>
            <h2 className="font-bold text-white text-sm">Apex Athletics</h2>
            <p className="text-[10px] text-gray-400">لوحة الإدارة</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                tab === t.id
                  ? "bg-gradient-to-r from-primary to-accent text-white"
                  : "text-gray-400 hover:bg-dark-surface hover:text-white"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all mt-4"
        >
          <span>🚪</span>
          <span>تسجيل الخروج</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mr-64 p-6 overflow-y-auto">
        {tab === "dashboard" && <DashboardTab data={analyticsData} />}
        {tab === "products" && (
          <ProductsTab
            products={products}
            onRefresh={onRefresh}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            showAdd={showAddProduct}
            setShowAdd={setShowAddProduct}
          />
        )}
        {tab === "orders" && <OrdersTab orders={ordersList} onRefresh={fetchOrders} />}
        {tab === "customers" && <CustomersTab users={usersList} onRefresh={fetchUsers} />}
        {tab === "media" && <MediaTab />}
        {tab === "settings" && <SettingsTab settings={siteSettings} onRefresh={fetchSettings} />}
        {tab === "plans" && <PlansTab />}
      </main>
    </div>
  );
}

/* ========== Dashboard Tab ========== */
function DashboardTab({ data }: { data: AnalyticsData | null }) {
  const stats = [
    { label: "إجمالي الإيرادات", value: `$${data?.totalRevenue?.toFixed(0) || 0}`, icon: "💰", color: "from-green-500 to-emerald-600" },
    { label: "إجمالي الطلبات", value: data?.totalOrders || 0, icon: "📦", color: "from-blue-500 to-cyan-600" },
    { label: "عدد المنتجات", value: data?.totalProducts || 0, icon: "🏷️", color: "from-purple-500 to-violet-600" },
    { label: "طلبات معلقة", value: data?.pendingOrders || 0, icon: "⏳", color: "from-yellow-500 to-orange-600" },
    { label: "طلبات مكتملة", value: data?.completedOrders || 0, icon: "✅", color: "from-green-400 to-teal-600" },
  ];

  const maxRevenue = Math.max(...(data?.monthlyRevenue?.map(m => m.revenue) || [1]));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black gradient-text">لوحة التحليلات</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white font-bold`}>
                Live
              </span>
            </div>
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">📈 الإيرادات الشهرية</h3>
          {data?.monthlyRevenue && data.monthlyRevenue.length > 0 ? (
            <div className="flex items-end gap-2 h-48">
              {data.monthlyRevenue.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-400">${m.revenue}</span>
                  <div
                    className="w-full bg-gradient-to-t from-primary to-accent rounded-t-lg min-h-[4px] transition-all"
                    style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                  />
                  <span className="text-[10px] text-gray-500">{m.month}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">لا توجد بيانات بعد</div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">📊 توزيع الفئات</h3>
          <div className="space-y-3">
            {data?.categoryDistribution?.map((cat, i) => {
              const totalProducts = data.categoryDistribution.reduce((s, c) => s + c.count, 0);
              const pct = totalProducts > 0 ? (cat.count / totalProducts) * 100 : 0;
              const colors = ["bg-primary", "bg-accent", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-pink-500"];
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{cat.category}</span>
                    <span className="text-gray-400">{cat.count} منتج</span>
                  </div>
                  <div className="h-2 bg-dark-surface rounded-full overflow-hidden">
                    <div className={`h-full ${colors[i % colors.length]} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {(!data?.categoryDistribution || data.categoryDistribution.length === 0) && (
              <div className="text-center text-gray-500 py-8">لا توجد بيانات بعد</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-bold text-white mb-4">🛍️ أحدث الطلبات</h3>
        {data?.recentOrders && data.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="py-2 text-right text-gray-400">العميل</th>
                  <th className="py-2 text-right text-gray-400">المبلغ</th>
                  <th className="py-2 text-right text-gray-400">الحالة</th>
                  <th className="py-2 text-right text-gray-400">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-primary/10">
                    <td className="py-3 text-white">{order.customerName}</td>
                    <td className="py-3 gradient-text font-bold">${order.totalAmount}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        order.status === "completed" ? "bg-green-500/20 text-green-400" :
                        order.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {order.status === "pending" ? "معلق" : order.status === "completed" ? "مكتمل" : order.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">{order.createdAt ? new Date(order.createdAt).toLocaleDateString("ar-EG") : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">لا توجد طلبات بعد</div>
        )}
      </div>

      {/* AI Insights */}
      <AIInsights data={data} />
    </div>
  );
}

/* ========== AI Insights Component ========== */
function AIInsights({ data }: { data: AnalyticsData | null }) {
  const generateInsights = () => {
    const insights: { type: "success" | "warning" | "info"; icon: string; title: string; description: string }[] = [];
    
    if (!data) return insights;

    // Revenue insights
    if (data.totalRevenue > 10000) {
      insights.push({
        type: "success",
        icon: "🚀",
        title: "أداء ممتاز!",
        description: `إجمالي الإيرادات تجاوز $10,000. استمر في هذا الأداء الرائع!`,
      });
    } else if (data.totalRevenue > 0) {
      insights.push({
        type: "info",
        icon: "💡",
        title: "فرصة للنمو",
        description: "جرب إضافة عروض ترويجية لزيادة المبيعات. الخصومات تجذب عملاء جدد!",
      });
    }

    // Orders insights
    if (data.pendingOrders > 5) {
      insights.push({
        type: "warning",
        icon: "⚠️",
        title: "طلبات معلقة",
        description: `لديك ${data.pendingOrders} طلب معلق. تأكد من متابعتها لتحسين رضا العملاء.`,
      });
    }

    const completionRate = data.totalOrders > 0 
      ? ((data.completedOrders / data.totalOrders) * 100).toFixed(0)
      : 0;
    
    if (Number(completionRate) >= 80) {
      insights.push({
        type: "success",
        icon: "✅",
        title: "معدل إتمام عالي",
        description: `نسبة إتمام الطلبات ${completionRate}%. هذا يدل على جودة الخدمة!`,
      });
    }

    // Product insights
    if (data.totalProducts < 10) {
      insights.push({
        type: "info",
        icon: "📦",
        title: "توسيع المنتجات",
        description: "أضف المزيد من المنتجات لزيادة فرص البيع وتنويع العروض.",
      });
    }

    // Category insights
    if (data.categoryDistribution && data.categoryDistribution.length > 0) {
      const topCategory = data.categoryDistribution.reduce((a, b) => a.count > b.count ? a : b);
      insights.push({
        type: "info",
        icon: "📊",
        title: "الفئة الأكثر شيوعاً",
        description: `فئة "${topCategory.category}" هي الأكثر بـ ${topCategory.count} منتج. ركز على تسويقها!`,
      });
    }

    // Time-based insights
    const hour = new Date().getHours();
    if (hour >= 9 && hour <= 17) {
      insights.push({
        type: "info",
        icon: "⏰",
        title: "وقت الذروة",
        description: "أنت في ساعات العمل الرئيسية. تابع الطلبات الجديدة!",
      });
    }

    return insights;
  };

  const insights = generateInsights();

  if (insights.length === 0) return null;

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🤖</span>
        <h3 className="font-bold text-white">تحليلات الذكاء الاصطناعي</h3>
        <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded-full">AI Powered</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border ${
              insight.type === "success" ? "bg-green-500/5 border-green-500/20" :
              insight.type === "warning" ? "bg-yellow-500/5 border-yellow-500/20" :
              "bg-primary/5 border-primary/20"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{insight.icon}</span>
              <div>
                <h4 className={`font-bold text-sm ${
                  insight.type === "success" ? "text-green-400" :
                  insight.type === "warning" ? "text-yellow-400" :
                  "text-primary-light"
                }`}>
                  {insight.title}
                </h4>
                <p className="text-xs text-gray-400 mt-1">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========== Products Tab ========== */
function ProductsTab({
  products, onRefresh, editingProduct, setEditingProduct, showAdd, setShowAdd,
}: {
  products: Product[];
  onRefresh: () => void;
  editingProduct: Product | null;
  setEditingProduct: (p: Product | null) => void;
  showAdd: boolean;
  setShowAdd: (b: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black gradient-text">إدارة المنتجات</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:shadow-lg transition-all"
        >
          + إضافة منتج
        </button>
      </div>

      {(showAdd || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onSave={() => { setShowAdd(false); setEditingProduct(null); onRefresh(); }}
          onCancel={() => { setShowAdd(false); setEditingProduct(null); }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(product => (
          <div key={product.id} className="glass-card rounded-xl p-4 flex gap-4">
            <img src={product.imageUrl} alt={product.nameAr} className="w-24 h-24 rounded-lg object-cover" />
            <div className="flex-1">
              <h4 className="font-bold text-white">{product.nameAr}</h4>
              <p className="text-xs text-accent">{product.name}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-black gradient-text">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="px-3 py-1 bg-primary/20 text-primary-light rounded-lg text-xs font-bold hover:bg-primary/30"
                >
                  تعديل
                </button>
                <button
                  onClick={async () => {
                    if (confirm("هل تريد حذف هذا المنتج؟")) {
                      await fetch(`/api/products?id=${product.id}`, { method: "DELETE" });
                      onRefresh();
                    }
                  }}
                  className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/30"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========== Product Form ========== */
function ProductForm({ product, onSave, onCancel }: { product: Product | null; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: product?.name || "",
    nameAr: product?.nameAr || "",
    description: product?.description || "",
    descriptionAr: product?.descriptionAr || "",
    price: product?.price?.toString() || "",
    originalPrice: product?.originalPrice?.toString() || "",
    discount: product?.discount?.toString() || "0",
    category: product?.category || "general",
    imageUrl: product?.imageUrl || "",
    features: (() => { try { return JSON.parse(product?.features || "[]").join(", "); } catch { return ""; } })(),
    badge: product?.badge || "",
    rating: product?.rating?.toString() || "5",
    reviewCount: product?.reviewCount?.toString() || "0",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    setUploadError("");
    setUploadSuccess(false);
    
    const fd = new FormData();
    fd.append("file", file);
    
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      
      if (res.ok && data.url) {
        setForm(f => ({ ...f, imageUrl: data.url }));
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setUploadError(data.error || "فشل في رفع الصورة");
      }
    } catch {
      setUploadError("حدث خطأ في الاتصال");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...(product ? { id: product.id } : {}),
      name: form.name,
      nameAr: form.nameAr,
      description: form.description,
      descriptionAr: form.descriptionAr,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
      discount: parseInt(form.discount) || 0,
      category: form.category,
      imageUrl: form.imageUrl,
      features: JSON.stringify(form.features.split(",").map((f: string) => f.trim()).filter(Boolean)),
      badge: form.badge || null,
      rating: parseFloat(form.rating) || 5,
      reviewCount: parseInt(form.reviewCount) || 0,
    };
    try {
      await fetch("/api/products", {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      onSave();
    } catch { /* ignore */ }
    setSaving(false);
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="font-bold text-white text-lg mb-4">{product ? "تعديل المنتج" : "إضافة منتج جديد"}</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="اسم المنتج (EN)" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
        <InputField label="اسم المنتج (AR)" value={form.nameAr} onChange={v => setForm(f => ({ ...f, nameAr: v }))} />
        <div className="md:col-span-2">
          <InputField label="الوصف (EN)" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} textarea />
        </div>
        <div className="md:col-span-2">
          <InputField label="الوصف (AR)" value={form.descriptionAr} onChange={v => setForm(f => ({ ...f, descriptionAr: v }))} textarea />
        </div>
        <InputField label="السعر" value={form.price} onChange={v => setForm(f => ({ ...f, price: v }))} type="number" />
        <InputField label="السعر الأصلي" value={form.originalPrice} onChange={v => setForm(f => ({ ...f, originalPrice: v }))} type="number" />
        <InputField label="نسبة الخصم %" value={form.discount} onChange={v => setForm(f => ({ ...f, discount: v }))} type="number" />
        <div>
          <label className="text-sm text-gray-400 mb-1 block">الفئة</label>
          <select
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
          >
            <option value="healthcare">الرعاية الصحية</option>
            <option value="fitness">اللياقة</option>
            <option value="retail">التجزئة</option>
            <option value="automotive">السيارات</option>
            <option value="enterprise">الشركات</option>
            <option value="hospitality">الضيافة</option>
            <option value="education">التعليم</option>
            <option value="general">عام</option>
          </select>
        </div>
        <InputField label="الميزات (مفصولة بفاصلة)" value={form.features} onChange={v => setForm(f => ({ ...f, features: v }))} />
        <InputField label="الشارة (مثل: Best Seller)" value={form.badge} onChange={v => setForm(f => ({ ...f, badge: v }))} />
        <InputField label="التقييم" value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} type="number" />
        <InputField label="عدد المراجعات" value={form.reviewCount} onChange={v => setForm(f => ({ ...f, reviewCount: v }))} type="number" />

        <div className="md:col-span-2">
          <label className="text-sm text-gray-400 mb-2 block">صورة المنتج</label>
          
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Preview */}
            {form.imageUrl && (
              <div className="relative">
                <img src={form.imageUrl} alt="preview" className="w-24 h-24 rounded-xl object-cover border-2 border-primary/30" />
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, imageUrl: "" }))}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            )}
            
            {/* Upload Area */}
            <div className="flex-1 w-full">
              <label className="block cursor-pointer">
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  uploading ? "border-yellow-500 bg-yellow-500/5" :
                  uploadSuccess ? "border-green-500 bg-green-500/5" :
                  uploadError ? "border-red-500 bg-red-500/5" :
                  "border-primary/30 hover:border-primary hover:bg-primary/5"
                }`}>
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-yellow-400">جاري رفع الصورة...</p>
                    </div>
                  ) : uploadSuccess ? (
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">✅</span>
                      <p className="text-sm text-green-400">تم رفع الصورة بنجاح!</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-3xl">📷</span>
                      <p className="text-sm text-gray-400">اضغط لرفع صورة</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (حتى 5MB)</p>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp" 
                  className="hidden" 
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
              
              {uploadError && (
                <p className="text-sm text-red-400 mt-2">❌ {uploadError}</p>
              )}
            </div>
          </div>
          
          {/* URL Input */}
          <div className="mt-3">
            <InputField 
              label="أو أدخل رابط الصورة مباشرة" 
              value={form.imageUrl} 
              onChange={v => setForm(f => ({ ...f, imageUrl: v }))} 
            />
          </div>
        </div>

        <div className="md:col-span-2 flex gap-3 justify-end">
          <button type="button" onClick={onCancel} className="px-6 py-2.5 border border-primary/30 text-gray-300 rounded-xl font-bold hover:bg-primary/10">
            إلغاء
          </button>
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold disabled:opacity-50">
            {saving ? "جاري الحفظ..." : product ? "تحديث" : "إضافة"}
          </button>
        </div>
      </form>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text", textarea }: { label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean }) {
  const cls = "w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";
  return (
    <div>
      <label className="text-sm text-gray-400 mb-1 block">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} className={cls} rows={3} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}

/* ========== Orders Tab ========== */
function OrdersTab({ orders, onRefresh }: { orders: OrderItem[]; onRefresh: () => void }) {
  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black gradient-text">إدارة الطلبات</h2>

      {orders.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-gray-400">لا توجد طلبات بعد</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            let items: { name?: string; quantity?: number; price?: number }[] = [];
            try { items = JSON.parse(order.items); } catch { items = []; }

            return (
              <div key={order.id} className="glass-card rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-white">{order.customerName}</h4>
                    <p className="text-xs text-gray-400">{order.customerEmail} | {order.customerPhone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={order.status || "pending"}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className="bg-dark-surface border border-primary/30 rounded-lg px-3 py-1 text-sm text-white"
                    >
                      <option value="pending">معلق</option>
                      <option value="processing">قيد التنفيذ</option>
                      <option value="completed">مكتمل</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  {items.map((item, i) => (
                    <div key={i} className="text-sm text-gray-300 flex justify-between">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="text-primary-light">${(item.price || 0) * (item.quantity || 1)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-primary/10">
                  <span className="text-xs text-gray-400">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString("ar-EG") : "-"}
                  </span>
                  <span className="text-lg font-black gradient-text">${order.totalAmount}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ========== Settings Tab ========== */
function SettingsTab({ settings, onRefresh }: { settings: Record<string, string>; onRefresh: () => void }) {
  const [form, setForm] = useState({
    siteName: settings.siteName || "Apex Athletics",
    siteDescription: settings.siteDescription || "حلول برمجية متكاملة",
    contactEmail: settings.contactEmail || "",
    contactPhone: settings.contactPhone || "",
    heroTitle: settings.heroTitle || "حلول برمجية متكاملة لجميع المجالات",
    heroSubtitle: settings.heroSubtitle || "نحن شركة رائدة في تطوير الأنظمة البرمجية الاحترافية",
    announcementBar: settings.announcementBar || "",
    siteLogoUrl: settings.siteLogoUrl || "/images/logo.svg",
    siteHeroImage: settings.siteHeroImage || "/images/hero-bg.svg",
  });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<"logo" | "hero" | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageUpload = async (type: "logo" | "hero", file: File | null) => {
    if (!file) return;

    setUploadingImage(type);
    setUploadError(null);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (res.ok && data.url) {
        setForm(prev => ({
          ...prev,
          ...(type === "logo" ? { siteLogoUrl: data.url } : { siteHeroImage: data.url }),
        }));
      } else {
        setUploadError(data.error || "فشل في رفع الصورة");
      }
    } catch {
      setUploadError("حدث خطأ في الاتصال أثناء رفع الصورة");
    }

    setUploadingImage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      onRefresh();
    } catch { /* ignore */ }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black gradient-text">إعدادات الموقع</h2>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <InputField label="اسم الموقع" value={form.siteName} onChange={v => setForm(f => ({ ...f, siteName: v }))} />
        <InputField label="وصف الموقع" value={form.siteDescription} onChange={v => setForm(f => ({ ...f, siteDescription: v }))} textarea />
        <InputField label="البريد الإلكتروني" value={form.contactEmail} onChange={v => setForm(f => ({ ...f, contactEmail: v }))} />
        <InputField label="رقم الهاتف" value={form.contactPhone} onChange={v => setForm(f => ({ ...f, contactPhone: v }))} />
        <InputField label="عنوان القسم الرئيسي" value={form.heroTitle} onChange={v => setForm(f => ({ ...f, heroTitle: v }))} />
        <InputField label="وصف القسم الرئيسي" value={form.heroSubtitle} onChange={v => setForm(f => ({ ...f, heroSubtitle: v }))} textarea />
        <InputField label="شريط الإعلان" value={form.announcementBar} onChange={v => setForm(f => ({ ...f, announcementBar: v }))} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400 block">شعار الموقع</label>
            <div className="flex items-center gap-3">
              <img src={form.siteLogoUrl} alt="logo preview" className="w-16 h-16 rounded-xl object-cover border border-primary/20" onError={(e) => { (e.target as HTMLImageElement).src = "/images/logo.svg"; }} />
              <div className="flex-1">
                <input
                  type="url"
                  value={form.siteLogoUrl}
                  onChange={e => setForm(f => ({ ...f, siteLogoUrl: e.target.value }))}
                  className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary"
                  placeholder="رابط الشعار"
                />
              </div>
            </div>
            <label className="block">
              <span className="inline-flex items-center px-4 py-2 rounded-xl bg-primary/15 text-primary-light text-sm font-bold cursor-pointer">
                {uploadingImage === "logo" ? "جاري الرفع..." : "رفع شعار جديد"}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                className="hidden"
                onChange={(e) => handleImageUpload("logo", e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400 block">صورة الهيرو</label>
            <div className="flex items-center gap-3">
              <img src={form.siteHeroImage} alt="hero preview" className="w-16 h-16 rounded-xl object-cover border border-primary/20" onError={(e) => { (e.target as HTMLImageElement).src = "/images/hero-bg.svg"; }} />
              <div className="flex-1">
                <input
                  type="url"
                  value={form.siteHeroImage}
                  onChange={e => setForm(f => ({ ...f, siteHeroImage: e.target.value }))}
                  className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary"
                  placeholder="رابط صورة الهيرو"
                />
              </div>
            </div>
            <label className="block">
              <span className="inline-flex items-center px-4 py-2 rounded-xl bg-primary/15 text-primary-light text-sm font-bold cursor-pointer">
                {uploadingImage === "hero" ? "جاري الرفع..." : "رفع صورة هيرو"}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                className="hidden"
                onChange={(e) => handleImageUpload("hero", e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </div>

        {uploadError && <p className="text-sm text-red-400">❌ {uploadError}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold disabled:opacity-50"
        >
          {saving ? "جاري الحفظ..." : "💾 حفظ الإعدادات"}
        </button>
      </div>
    </div>
  );
}

/* ========== Plans Tab ========== */
function PlansTab() {
  const plans = [
    {
      quarter: "Q1 2025",
      title: "التوسع في الأنظمة",
      items: ["نظام إدارة المطاعم", "نظام إدارة الفنادق", "نظام إدارة العيادات", "تطبيقات الجوال"],
      status: "in-progress",
    },
    {
      quarter: "Q2 2025",
      title: "التكامل والذكاء الاصطناعي",
      items: ["تكامل مع بوابات الدفع", "تقارير ذكية بالـ AI", "نظام دردشة آلي", "تحليلات متقدمة"],
      status: "planned",
    },
    {
      quarter: "Q3 2025",
      title: "التوسع الإقليمي",
      items: ["دعم اللغة الإنجليزية الكامل", "التوسع في الخليج العربي", "شراكات استراتيجية", "مركز تدريب"],
      status: "planned",
    },
    {
      quarter: "Q4 2025",
      title: "المنصة السحابية",
      items: ["إطلاق SaaS Platform", "نظام اشتراكات شهرية", "API مفتوح للمطورين", "متجر إضافات"],
      status: "planned",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black gradient-text">الخطط المستقبلية</h2>
      <p className="text-gray-400">رؤيتنا الاستراتيجية لتطوير Apex Athletics خلال العام القادم</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan, i) => (
          <div key={i} className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-accent">{plan.quarter}</span>
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                plan.status === "in-progress" ? "bg-yellow-500/20 text-yellow-400" : "bg-primary/20 text-primary-light"
              }`}>
                {plan.status === "in-progress" ? "قيد التنفيذ" : "مخطط"}
              </span>
            </div>
            <h3 className="font-bold text-white text-lg mb-3">{plan.title}</h3>
            <ul className="space-y-2">
              {plan.items.map((item, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Vision */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-bold text-white text-lg mb-3">🎯 رؤيتنا</h3>
        <p className="text-gray-400 leading-relaxed">
          نطمح في Apex Athletics أن نكون الشركة الرائدة في مجال الحلول البرمجية في المنطقة العربية.
          هدفنا هو تقديم أنظمة ذكية ومتكاملة تساعد الشركات والمؤسسات على تحقيق أقصى كفاءة تشغيلية.
          نؤمن بأن التكنولوجيا يجب أن تكون في متناول الجميع، ونعمل على جعل أنظمتنا سهلة الاستخدام ومتوافقة مع كل الأحجام.
        </p>
      </div>
    </div>
  );
}

/* ========== Customers Tab ========== */
function CustomersTab({ users, onRefresh }: { users: UserItem[]; onRefresh: () => void }) {
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [walletAction, setWalletAction] = useState<"deposit" | "withdraw" | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleWalletAction = async () => {
    if (!selectedUser || !amount || !walletAction) return;
    setProcessing(true);

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          amount: parseFloat(amount),
          type: walletAction,
          description: walletAction === "deposit" ? "إيداع من الإدارة" : "سحب من الإدارة",
          adminNote: note,
        }),
      });

      if (res.ok) {
        alert("تم بنجاح!");
        setSelectedUser(null);
        setWalletAction(null);
        setAmount("");
        setNote("");
        onRefresh();
      } else {
        const data = await res.json();
        alert(data.error || "حدث خطأ");
      }
    } catch {
      alert("حدث خطأ في الاتصال");
    }
    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black gradient-text">إدارة العملاء والمحافظ</h2>
        <div className="text-sm text-gray-400">
          إجمالي العملاء: <span className="text-white font-bold">{users.length}</span>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-bold text-gray-400">لا يوجد عملاء مسجلين بعد</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map(user => (
            <div key={user.id} className="glass-card rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center text-white text-lg font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{user.name}</h4>
                    <p className="text-xs text-gray-400">{user.email}</p>
                    {user.phone && <p className="text-xs text-gray-500">{user.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Wallet Balance */}
              <div className="bg-dark-surface rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">رصيد المحفظة</span>
                  <span className="text-2xl font-black gradient-text">
                    ${(user.walletBalance || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => { setSelectedUser(user); setWalletAction("deposit"); }}
                  className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-xl text-sm font-bold hover:bg-green-500/30"
                >
                  + إيداع
                </button>
                <button
                  onClick={() => { setSelectedUser(user); setWalletAction("withdraw"); }}
                  className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500/30"
                >
                  - سحب
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                تسجيل: {user.createdAt ? new Date(user.createdAt).toLocaleDateString("ar-EG") : "-"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Wallet Action Modal */}
      {selectedUser && walletAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => { setSelectedUser(null); setWalletAction(null); }} />
          <div className="relative w-full max-w-md bg-dark-card rounded-2xl p-6 border border-primary/20">
            <h3 className="text-lg font-bold text-white mb-4">
              {walletAction === "deposit" ? "➕ إيداع في المحفظة" : "➖ سحب من المحفظة"}
            </h3>
            
            <div className="mb-4 p-3 bg-dark-surface rounded-xl">
              <p className="text-sm text-gray-400">العميل:</p>
              <p className="font-bold text-white">{selectedUser.name}</p>
              <p className="text-xs text-gray-500">الرصيد الحالي: ${(selectedUser.walletBalance || 0).toFixed(2)}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">المبلغ ($)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">ملاحظة (اختياري)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="سبب العملية..."
                  className="w-full bg-dark-surface border border-primary/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setSelectedUser(null); setWalletAction(null); setAmount(""); setNote(""); }}
                className="flex-1 py-3 border border-primary/30 text-gray-300 rounded-xl font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={handleWalletAction}
                disabled={!amount || processing}
                className={`flex-1 py-3 rounded-xl font-bold text-white disabled:opacity-50 ${
                  walletAction === "deposit" 
                    ? "bg-gradient-to-r from-green-500 to-emerald-600" 
                    : "bg-gradient-to-r from-red-500 to-red-600"
                }`}
              >
                {processing ? "جاري التنفيذ..." : "تأكيد"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========== Media Tab ========== */
function MediaTab() {
  const [images, setImages] = useState<{ name: string; url: string; type: string }[]>([
    { name: "شعار الموقع", url: "/images/logo.png", type: "logo" },
    { name: "خلفية الهيرو", url: "/images/hero-bg.jpg", type: "hero" },
    { name: "نظام الصيدلية", url: "/images/pharmacy-system.jpg", type: "product" },
    { name: "نظام الجيم", url: "/images/gym-system.jpg", type: "product" },
    { name: "نظام البقالة", url: "/images/grocery-system.jpg", type: "product" },
    { name: "نظام قطع الغيار", url: "/images/autoparts-system.jpg", type: "product" },
    { name: "نظام المستشفى", url: "/images/hospital-system.jpg", type: "product" },
    { name: "نظام الشركات", url: "/images/company-system.jpg", type: "product" },
    { name: "نظام المطاعم", url: "/images/restaurant-system.jpg", type: "product" },
    { name: "نظام الفنادق", url: "/images/hotel-system.jpg", type: "product" },
  ]);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fd = new FormData();
      fd.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) {
          setUploadedImages(prev => [...prev, data.url]);
        }
      } catch {
        console.error("Upload failed for:", file.name);
      }
    }

    setUploading(false);
    e.target.value = "";
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("تم نسخ الرابط!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black gradient-text">صور الموقع</h2>
      </div>

      {/* Upload Section */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <span>📤</span> رفع صور جديدة
        </h3>
        
        <label className="block cursor-pointer">
          <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            uploading ? "border-yellow-500 bg-yellow-500/5" : "border-primary/30 hover:border-primary hover:bg-primary/5"
          }`}>
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-yellow-400">جاري رفع الصور...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <span className="text-5xl">📷</span>
                <p className="text-white font-bold">اضغط أو اسحب الصور هنا</p>
                <p className="text-sm text-gray-400">PNG, JPG, GIF, WebP (حتى 5MB لكل صورة)</p>
                <p className="text-xs text-gray-500">يمكنك رفع عدة صور في نفس الوقت</p>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>

        {/* Uploaded Images */}
        {uploadedImages.length > 0 && (
          <div className="mt-6">
            <h4 className="font-bold text-white mb-3">✅ الصور المرفوعة حديثاً</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {uploadedImages.map((url, i) => (
                <div key={i} className="relative group">
                  <img
                    src={url}
                    alt={`Uploaded ${i + 1}`}
                    className="w-full h-32 object-cover rounded-xl border border-primary/20"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                    <button
                      onClick={() => copyUrl(url)}
                      className="p-2 bg-primary rounded-lg text-white text-xs"
                    >
                      نسخ الرابط
                    </button>
                    <button
                      onClick={() => setSelectedImage(url)}
                      className="p-2 bg-white/20 rounded-lg text-white text-xs"
                    >
                      عرض
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 truncate">{url}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Current Site Images */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <span>🖼️</span> صور الموقع الحالية
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-28 object-cover rounded-xl border border-primary/20"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/logo.png";
                }}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-1">
                <button
                  onClick={() => copyUrl(img.url)}
                  className="p-1.5 bg-primary rounded-lg text-white text-[10px]"
                >
                  نسخ
                </button>
                <button
                  onClick={() => setSelectedImage(img.url)}
                  className="p-1.5 bg-white/20 rounded-lg text-white text-[10px]"
                >
                  عرض
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1 text-center truncate">{img.name}</p>
              <span className={`absolute top-1 right-1 text-[8px] px-1.5 py-0.5 rounded-full ${
                img.type === "logo" ? "bg-purple-500" :
                img.type === "hero" ? "bg-blue-500" : "bg-green-500"
              } text-white`}>
                {img.type === "logo" ? "شعار" : img.type === "hero" ? "هيرو" : "منتج"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <span>💡</span> كيفية استخدام الصور
        </h3>
        <div className="space-y-3 text-sm text-gray-400">
          <p>1. ارفع الصورة من خلال منطقة الرفع أعلاه</p>
          <p>2. انسخ رابط الصورة بالضغط على "نسخ الرابط"</p>
          <p>3. استخدم الرابط في:</p>
          <ul className="list-disc list-inside mr-4 space-y-1">
            <li>إضافة منتج جديد (حقل صورة المنتج)</li>
            <li>تعديل منتج موجود</li>
            <li>أي مكان آخر يتطلب رابط صورة</li>
          </ul>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setSelectedImage(null)} />
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] rounded-xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              onClick={() => copyUrl(selectedImage)}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 bg-primary rounded-xl text-white font-bold"
            >
              نسخ الرابط
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

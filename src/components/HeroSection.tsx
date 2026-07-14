"use client";

export default function HeroSection({ siteSettings }: { siteSettings?: Record<string, string> }) {
  const heroImage = siteSettings?.siteHeroImage || "/images/hero-bg.svg";
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img src={heroImage} alt="hero background" className="w-full h-full object-cover opacity-25" onError={(e) => { (e.target as HTMLImageElement).src = "/images/hero-bg.svg"; }} />
        <div className="absolute inset-0 bg-gradient-to-br from-dark/90 via-dark/60 to-dark/95" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
        {/* Logo */}
        <div className="mb-8 animate-slide-up">
          <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-primary to-accent">
            <img
              src={siteSettings?.siteLogoUrl || "/images/logo.svg"}
              alt={siteSettings?.siteName || "Apex Athletics"}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "/images/logo.svg"; }}
            />
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 animate-slide-up" >
          <span className="gradient-text">{siteSettings?.siteName || "Apex Athletics"}</span>
        </h1>

        <p className="text-xl sm:text-2xl text-gray-300 mb-4 animate-slide-up" >
          {siteSettings?.heroTitle || "حلول برمجية متكاملة لجميع المجالات"}
        </p>

        <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed animate-slide-up" >
          {siteSettings?.heroSubtitle || "نحن شركة رائدة في تطوير الأنظمة البرمجية الاحترافية. نقدم حلولاً ذكية ومتكاملة للصيدليات والمستشفيات وصالات الرياضة ومتاجر البقالة ومحلات قطع الغيار والشركات. تقنيات حديثة، أداء فائق، ودعم فني مستمر."}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-10 animate-slide-up" >
          {[
            { value: "+500", label: "عميل سعيد" },
            { value: "+50", label: "نظام برمجي" },
            { value: "24/7", label: "دعم فني" },
            { value: "99.9%", label: "وقت التشغيل" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4">
              <div className="text-2xl sm:text-3xl font-black gradient-text">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 animate-slide-up" >
          <a
            href="#products"
            className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-primary/30 transition-all hover:scale-105"
          >
            تصفح المنتجات
          </a>
          <a
            href="#contact"
            className="px-8 py-4 border-2 border-primary/50 text-white rounded-xl font-bold text-lg hover:bg-primary/10 transition-all hover:scale-105"
          >
            تواصل معنا
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16">
          <svg className="w-8 h-8 mx-auto text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

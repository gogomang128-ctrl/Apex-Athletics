"use client";

interface FooterProps {
  onAdminClick?: () => void;
  siteSettings?: Record<string, string>;
}

export default function Footer({ onAdminClick, siteSettings }: FooterProps) {
  const logoUrl = siteSettings?.siteLogoUrl || "/images/logo.svg";
  return (
    <footer id="contact" className="border-t border-primary/20 bg-dark-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoUrl} alt={siteSettings?.siteName || "Apex Athletics"} className="w-12 h-12 rounded-xl object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/images/logo.svg"; }} />
              <div>
                <h3 className="text-xl font-bold gradient-text">{siteSettings?.siteName || "Apex Athletics"}</h3>
                <p className="text-xs text-gray-400">{siteSettings?.siteDescription || "Digital Solutions"}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
              شركة Apex Athletics هي شركة رائدة في مجال تطوير البرمجيات والأنظمة الرقمية.
              نقدم حلولاً متكاملة وعصرية لجميع المجالات التجارية والطبية والرياضية.
              هدفنا هو تمكين عملائنا من إدارة أعمالهم بكفاءة عالية.
            </p>
            <div className="flex gap-3">
              {["📧", "📱", "🌐", "💬"].map((icon, i) => (
                <div key={i} className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-lg hover:bg-primary/20 transition-colors cursor-pointer">
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {["الرئيسية", "المنتجات", "من نحن", "تواصل معنا", "الأسئلة الشائعة"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-400 hover:text-primary-light transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-white mb-4">خدماتنا</h4>
            <ul className="space-y-2">
              {["أنظمة الصيدليات", "أنظمة المستشفيات", "أنظمة الجيم", "أنظمة البقالة", "أنظمة الشركات", "حلول مخصصة"].map((service) => (
                <li key={service}>
                  <a href="#products" className="text-sm text-gray-400 hover:text-primary-light transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2024 Apex Athletics. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-gray-500 hover:text-primary-light">سياسة الخصوصية</a>
            <a href="#" className="text-xs text-gray-500 hover:text-primary-light">الشروط والأحكام</a>
            
            {/* Admin Button - Small and at bottom */}
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                إدارة
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

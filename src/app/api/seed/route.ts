import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { v4 as uuid } from "uuid";

const defaultProducts = [
  // Healthcare - الرعاية الصحية
  {
    id: uuid(),
    name: "Pharmacy Management System",
    nameAr: "نظام إدارة الصيدلية",
    description: "Complete pharmacy management solution with inventory tracking, prescription management, expiry alerts, billing, and customer management. Supports barcode scanning and multi-branch operations.",
    descriptionAr: "نظام متكامل لإدارة الصيدليات يشمل تتبع المخزون، إدارة الوصفات الطبية، تنبيهات انتهاء الصلاحية، الفوترة الإلكترونية، وإدارة بيانات العملاء. يدعم مسح الباركود والعمل على فروع متعددة مع تقارير مفصلة.",
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    category: "healthcare",
    imageUrl: "/images/pharmacy-system.jpg",
    features: JSON.stringify(["إدارة المخزون", "تتبع الوصفات", "تنبيهات الصلاحية", "مسح الباركود", "دعم الفروع", "الفوترة", "قاعدة بيانات العملاء", "التقارير"]),
    badge: "الأكثر مبيعاً",
    rating: 4.9,
    reviewCount: 234,
  },
  {
    id: uuid(),
    name: "Hospital Management System",
    nameAr: "نظام إدارة المستشفى",
    description: "Enterprise-grade hospital management system with patient records, appointment scheduling, lab management, pharmacy integration, billing, and comprehensive reporting.",
    descriptionAr: "نظام شامل لإدارة المستشفيات يتضمن السجلات الطبية الإلكترونية، جدولة المواعيد، إدارة المختبرات، تكامل مع الصيدلية، نظام الفوترة والتأمين، وتقارير تحليلية متقدمة للإدارة.",
    price: 9999,
    originalPrice: 14999,
    discount: 33,
    category: "healthcare",
    imageUrl: "/images/hospital-system.jpg",
    features: JSON.stringify(["السجلات الطبية EMR", "جدولة المواعيد", "إدارة المختبر", "تكامل الصيدلية", "الفوترة والتأمين", "إدارة الموظفين", "التقارير المتقدمة", "تطبيق الجوال"]),
    badge: "للمؤسسات",
    rating: 4.9,
    reviewCount: 98,
  },
  {
    id: uuid(),
    name: "Dental Clinic System",
    nameAr: "نظام عيادة الأسنان",
    description: "Specialized dental clinic management with patient dental charts, treatment planning, appointment scheduling, and billing integration.",
    descriptionAr: "نظام متخصص لعيادات الأسنان يشمل سجلات الأسنان التفصيلية، تخطيط العلاج، جدولة المواعيد، إدارة المخزون الطبي، والفوترة. مع دعم صور الأشعة وخرائط الأسنان التفاعلية.",
    price: 3499,
    originalPrice: 5499,
    discount: 36,
    category: "healthcare",
    imageUrl: "/images/hospital-system.jpg",
    features: JSON.stringify(["خرائط الأسنان", "تخطيط العلاج", "إدارة المواعيد", "صور الأشعة", "الفوترة", "تذكير المرضى", "المخزون الطبي", "التقارير"]),
    badge: "متخصص",
    rating: 4.8,
    reviewCount: 156,
  },

  // Fitness - اللياقة
  {
    id: uuid(),
    name: "Gym Management System",
    nameAr: "نظام إدارة الجيم",
    description: "All-in-one gym management platform with member registration, subscription plans, workout tracking, trainer scheduling, payment processing.",
    descriptionAr: "منصة متكاملة لإدارة صالات الرياضة تشمل تسجيل الأعضاء، إدارة خطط الاشتراك، تتبع التمارين والتقدم، جدولة المدربين، بوابة الدفع الإلكتروني، ونظام الحضور بالبصمة.",
    price: 1999,
    originalPrice: 3499,
    discount: 43,
    category: "fitness",
    imageUrl: "/images/gym-system.jpg",
    features: JSON.stringify(["إدارة الأعضاء", "خطط الاشتراك", "تتبع التمارين", "جدولة المدربين", "بوابة الدفع", "نظام الحضور", "تطبيق الجوال", "التحليلات"]),
    badge: "شائع",
    rating: 4.8,
    reviewCount: 189,
  },
  {
    id: uuid(),
    name: "Sports Academy System",
    nameAr: "نظام الأكاديمية الرياضية",
    description: "Complete sports academy management for football, basketball, swimming academies with student tracking, coach management, and tournament organization.",
    descriptionAr: "نظام شامل لإدارة الأكاديميات الرياضية (كرة قدم، سباحة، كرة سلة) يشمل تسجيل الطلاب، متابعة التقدم، إدارة المدربين، تنظيم البطولات، وإدارة الفرق.",
    price: 2499,
    originalPrice: 3999,
    discount: 38,
    category: "fitness",
    imageUrl: "/images/gym-system.jpg",
    features: JSON.stringify(["تسجيل الطلاب", "متابعة التقدم", "إدارة المدربين", "تنظيم البطولات", "إدارة الفرق", "جدول التدريب", "تقارير الأداء", "إشعارات الأهل"]),
    badge: "جديد",
    rating: 4.7,
    reviewCount: 87,
  },

  // Retail - التجزئة
  {
    id: uuid(),
    name: "Grocery Store System",
    nameAr: "نظام إدارة البقالة",
    description: "Smart grocery store management with POS system, inventory control, supplier management, delivery tracking, and real-time stock alerts.",
    descriptionAr: "نظام ذكي لإدارة متاجر البقالة والسوبر ماركت يشمل نقاط البيع، التحكم بالمخزون، إدارة الموردين، تتبع التوصيل، تنبيهات المخزون الفورية، وإدارة العروض والخصومات.",
    price: 1499,
    originalPrice: 2499,
    discount: 40,
    category: "retail",
    imageUrl: "/images/grocery-system.jpg",
    features: JSON.stringify(["نقاط البيع POS", "إدارة المخزون", "إدارة الموردين", "تتبع التوصيل", "تنبيهات المخزون", "الباركود", "الفروع المتعددة", "التقارير المالية"]),
    badge: "الأفضل للمتاجر",
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: uuid(),
    name: "Clothing Store System",
    nameAr: "نظام متجر الملابس",
    description: "Fashion retail management system with size/color variants, seasonal inventory, loyalty programs, and e-commerce integration.",
    descriptionAr: "نظام متخصص لمتاجر الملابس والأزياء يدعم المقاسات والألوان المتعددة، إدارة المواسم والتشكيلات، برامج الولاء، التكامل مع المتجر الإلكتروني، وتتبع اتجاهات المبيعات.",
    price: 1799,
    originalPrice: 2999,
    discount: 40,
    category: "retail",
    imageUrl: "/images/grocery-system.jpg",
    features: JSON.stringify(["إدارة المقاسات/الألوان", "المواسم والتشكيلات", "برامج الولاء", "التكامل الإلكتروني", "تتبع المبيعات", "إدارة المرتجعات", "العروض", "التقارير"]),
    badge: "للأزياء",
    rating: 4.6,
    reviewCount: 124,
  },
  {
    id: uuid(),
    name: "Electronics Store System",
    nameAr: "نظام متجر الإلكترونيات",
    description: "Electronics retail management with warranty tracking, serial number management, repair service integration, and technical specifications database.",
    descriptionAr: "نظام لمتاجر الإلكترونيات والأجهزة يشمل تتبع الضمان، إدارة الأرقام التسلسلية، تكامل مع خدمات الصيانة، قاعدة بيانات المواصفات التقنية، وإدارة قطع الغيار.",
    price: 2199,
    originalPrice: 3499,
    discount: 37,
    category: "retail",
    imageUrl: "/images/grocery-system.jpg",
    features: JSON.stringify(["تتبع الضمان", "الأرقام التسلسلية", "خدمات الصيانة", "المواصفات التقنية", "قطع الغيار", "الباركود", "التقسيط", "التقارير"]),
    badge: "تقني",
    rating: 4.7,
    reviewCount: 98,
  },

  // Automotive - السيارات
  {
    id: uuid(),
    name: "Auto Parts Shop System",
    nameAr: "نظام محل قطع الغيار",
    description: "Comprehensive auto parts management system with vehicle compatibility lookup, parts catalog, warranty tracking, and customer vehicle history.",
    descriptionAr: "نظام شامل لمحلات قطع غيار السيارات يشمل البحث عن توافق القطع مع الموديلات، كتالوج القطع، تتبع الضمان، سجل مركبات العملاء، ودعم القطع الأصلية والبديلة.",
    price: 2499,
    originalPrice: 3999,
    discount: 38,
    category: "automotive",
    imageUrl: "/images/autoparts-system.jpg",
    features: JSON.stringify(["توافق المركبات", "كتالوج القطع", "تتبع الضمان", "سجل المركبات", "القطع الأصلية/البديلة", "الباركود", "إدارة الطلبات", "الموردين"]),
    badge: "متخصص",
    rating: 4.8,
    reviewCount: 143,
  },
  {
    id: uuid(),
    name: "Car Wash System",
    nameAr: "نظام مغسلة السيارات",
    description: "Car wash management system with service packages, membership plans, queue management, and employee performance tracking.",
    descriptionAr: "نظام إدارة مغاسل السيارات يشمل باقات الخدمات، خطط العضوية والاشتراكات، إدارة الطوابير، تتبع أداء الموظفين، وحجز المواعيد أونلاين.",
    price: 999,
    originalPrice: 1799,
    discount: 44,
    category: "automotive",
    imageUrl: "/images/autoparts-system.jpg",
    features: JSON.stringify(["باقات الخدمات", "العضويات", "إدارة الطوابير", "تتبع الموظفين", "حجز المواعيد", "الفوترة", "التقارير", "تطبيق العملاء"]),
    badge: "سهل",
    rating: 4.6,
    reviewCount: 201,
  },
  {
    id: uuid(),
    name: "Car Service Center System",
    nameAr: "نظام مركز صيانة السيارات",
    description: "Complete auto service center management with job cards, parts inventory, mechanic assignment, and service history tracking.",
    descriptionAr: "نظام متكامل لمراكز صيانة السيارات يشمل بطاقات العمل، مخزون قطع الغيار، توزيع المهام على الفنيين، تتبع سجل الصيانة، وتقديرات التكلفة للعملاء.",
    price: 2999,
    originalPrice: 4499,
    discount: 33,
    category: "automotive",
    imageUrl: "/images/autoparts-system.jpg",
    features: JSON.stringify(["بطاقات العمل", "مخزون القطع", "توزيع الفنيين", "سجل الصيانة", "تقديرات التكلفة", "تنبيهات الصيانة", "ضمان الخدمة", "التقارير"]),
    badge: "احترافي",
    rating: 4.8,
    reviewCount: 167,
  },

  // Enterprise - الشركات
  {
    id: uuid(),
    name: "Company ERP System",
    nameAr: "نظام ERP للشركات",
    description: "Full-featured enterprise resource planning system with HR management, project tracking, financial accounting, CRM, and team collaboration.",
    descriptionAr: "نظام تخطيط موارد المؤسسات الشامل يتضمن إدارة الموارد البشرية، تتبع المشاريع، المحاسبة المالية، إدارة علاقات العملاء، وأدوات التعاون بين الفرق.",
    price: 5999,
    originalPrice: 9999,
    discount: 40,
    category: "enterprise",
    imageUrl: "/images/company-system.jpg",
    features: JSON.stringify(["إدارة الموارد البشرية", "تتبع المشاريع", "المحاسبة المالية", "إدارة العملاء CRM", "إدارة المستندات", "التعاون الجماعي", "صلاحيات المستخدمين", "التقارير المخصصة"]),
    badge: "متكامل",
    rating: 4.9,
    reviewCount: 276,
  },
  {
    id: uuid(),
    name: "Law Firm System",
    nameAr: "نظام المكتب القانوني",
    description: "Legal practice management with case tracking, document management, billing hours, court dates, and client communication portal.",
    descriptionAr: "نظام إدارة المكاتب القانونية يشمل تتبع القضايا، إدارة المستندات القانونية، حساب ساعات العمل، مواعيد المحاكم، وبوابة التواصل مع العملاء.",
    price: 3999,
    originalPrice: 5999,
    discount: 33,
    category: "enterprise",
    imageUrl: "/images/company-system.jpg",
    features: JSON.stringify(["تتبع القضايا", "إدارة المستندات", "ساعات العمل", "مواعيد المحاكم", "بوابة العملاء", "الفوترة", "التقويم القانوني", "التقارير"]),
    badge: "قانوني",
    rating: 4.7,
    reviewCount: 89,
  },
  {
    id: uuid(),
    name: "Real Estate System",
    nameAr: "نظام العقارات",
    description: "Real estate agency management with property listings, client matching, contract management, and commission tracking.",
    descriptionAr: "نظام إدارة الوكالات العقارية يشمل قوائم العقارات، مطابقة العملاء مع العقارات المناسبة، إدارة العقود، تتبع العمولات، وجدولة المعاينات.",
    price: 2799,
    originalPrice: 4499,
    discount: 38,
    category: "enterprise",
    imageUrl: "/images/company-system.jpg",
    features: JSON.stringify(["قوائم العقارات", "مطابقة العملاء", "إدارة العقود", "تتبع العمولات", "جدولة المعاينات", "التسويق العقاري", "التقارير", "تطبيق الجوال"]),
    badge: "عقاري",
    rating: 4.6,
    reviewCount: 134,
  },

  // Hospitality - الضيافة (قسم جديد)
  {
    id: uuid(),
    name: "Restaurant POS System",
    nameAr: "نظام إدارة المطاعم",
    description: "Complete restaurant management with table reservations, menu management, kitchen display, order tracking, and delivery integration.",
    descriptionAr: "نظام متكامل لإدارة المطاعم يشمل حجز الطاولات، إدارة قوائم الطعام، شاشة المطبخ، تتبع الطلبات، التكامل مع خدمات التوصيل، وبرامج ولاء العملاء.",
    price: 2499,
    originalPrice: 3999,
    discount: 38,
    category: "hospitality",
    imageUrl: "/images/restaurant-system.jpg",
    features: JSON.stringify(["حجز الطاولات", "إدارة القوائم", "شاشة المطبخ", "تتبع الطلبات", "التوصيل", "برامج الولاء", "إدارة المخزون", "التقارير"]),
    badge: "للمطاعم",
    rating: 4.8,
    reviewCount: 312,
  },
  {
    id: uuid(),
    name: "Hotel Management System",
    nameAr: "نظام إدارة الفنادق",
    description: "Comprehensive hotel management with room booking, guest check-in/out, housekeeping management, and revenue optimization.",
    descriptionAr: "نظام شامل لإدارة الفنادق يشمل حجز الغرف، تسجيل الدخول والخروج، إدارة التدبير المنزلي، تحسين الإيرادات، إدارة المطاعم والخدمات الإضافية.",
    price: 7999,
    originalPrice: 11999,
    discount: 33,
    category: "hospitality",
    imageUrl: "/images/hotel-system.jpg",
    features: JSON.stringify(["حجز الغرف", "تسجيل النزلاء", "التدبير المنزلي", "إدارة الإيرادات", "المطاعم والبارات", "الفوترة", "تقارير الإشغال", "تطبيق النزلاء"]),
    badge: "فندقي",
    rating: 4.9,
    reviewCount: 178,
  },
  {
    id: uuid(),
    name: "Cafe Management System",
    nameAr: "نظام إدارة الكافيهات",
    description: "Modern cafe management with quick POS, loyalty cards, inventory for ingredients, and social media integration for promotions.",
    descriptionAr: "نظام عصري لإدارة الكافيهات يشمل نقاط بيع سريعة، بطاقات الولاء، إدارة مخزون المكونات، التكامل مع وسائل التواصل للعروض، وإدارة الورديات.",
    price: 1299,
    originalPrice: 2199,
    discount: 41,
    category: "hospitality",
    imageUrl: "/images/restaurant-system.jpg",
    features: JSON.stringify(["نقاط بيع سريعة", "بطاقات الولاء", "مخزون المكونات", "العروض الترويجية", "إدارة الورديات", "تقارير المبيعات", "طلبات الجوال", "التحليلات"]),
    badge: "عصري",
    rating: 4.7,
    reviewCount: 245,
  },

  // Education - التعليم (قسم جديد)
  {
    id: uuid(),
    name: "School Management System",
    nameAr: "نظام إدارة المدارس",
    description: "Complete school management with student records, attendance, grades, parent portal, and online learning integration.",
    descriptionAr: "نظام شامل لإدارة المدارس يشمل سجلات الطلاب، الحضور والغياب، إدارة الدرجات، بوابة أولياء الأمور، التكامل مع التعليم الإلكتروني، وإدارة الرسوم الدراسية.",
    price: 4999,
    originalPrice: 7999,
    discount: 38,
    category: "education",
    imageUrl: "/images/company-system.jpg",
    features: JSON.stringify(["سجلات الطلاب", "الحضور والغياب", "إدارة الدرجات", "بوابة الأهل", "التعليم الإلكتروني", "الرسوم الدراسية", "الجدول الدراسي", "التقارير"]),
    badge: "تعليمي",
    rating: 4.8,
    reviewCount: 203,
  },
  {
    id: uuid(),
    name: "Training Center System",
    nameAr: "نظام مركز التدريب",
    description: "Training center management with course scheduling, trainer management, certificate generation, and online exam system.",
    descriptionAr: "نظام إدارة مراكز التدريب يشمل جدولة الدورات، إدارة المدربين، إصدار الشهادات، نظام الاختبارات الإلكترونية، وتسجيل المتدربين أونلاين.",
    price: 2999,
    originalPrice: 4499,
    discount: 33,
    category: "education",
    imageUrl: "/images/company-system.jpg",
    features: JSON.stringify(["جدولة الدورات", "إدارة المدربين", "إصدار الشهادات", "الاختبارات الإلكترونية", "التسجيل أونلاين", "المواد التعليمية", "تتبع التقدم", "التقارير"]),
    badge: "تدريبي",
    rating: 4.6,
    reviewCount: 167,
  },
];

export async function POST() {
  try {
    const existing = await db.select({ id: products.id }).from(products).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ message: "Already seeded" });
    }
    await db.insert(products).values(defaultProducts);
    return NextResponse.json({ message: "Seeded successfully", count: defaultProducts.length });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const existing = await db.select({ id: products.id }).from(products).limit(1);
    if (existing.length === 0) {
      await db.insert(products).values(defaultProducts);
      return NextResponse.json({ message: "Seeded successfully", count: defaultProducts.length });
    }
    return NextResponse.json({ message: "Already seeded" });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await db.delete(products);
    await db.insert(products).values(defaultProducts);
    return NextResponse.json({ message: "Reset and seeded successfully", count: defaultProducts.length });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

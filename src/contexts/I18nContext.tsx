import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "ar" | "en";
type Dict = Record<string, { ar: string; en: string }>;

export const t: Dict = {
    "nav.home": { ar: "الرئيسية", en: "Home" },
    "nav.services": { ar: "الخدمات", en: "Services" },
    "nav.booking": { ar: "احجز موعد", en: "Booking" },
    "nav.reviews": { ar: "آراء العملاء", en: "Reviews" },
    "nav.admin": { ar: "الإدارة", en: "Admin" },
    "nav.login": { ar: "تسجيل الدخول", en: "Login" },
    "nav.logout": { ar: "تسجيل خروج", en: "Logout" },
    "nav.bookNow": { ar: "احجز الآن", en: "Book Now" },
    "brand.sub": { ar: "مغسلة البرنس", en: "Al-Prince Car Wash" },
    "hero.badge": { ar: "خدمات سيارات فاخرة منذ 2015", en: "PREMIUM CAR CARE SINCE 2015" },
    "hero.welcome": { ar: "أهلاً بك في", en: "Welcome to" },
    "hero.brand": { ar: "مغسلة البرنس", en: "Al-Prince" },
    "hero.desc": { ar: "نقدم خدمات غسيل وتلميع السيارات بأعلى معايير الجودة والاحترافية. سيارتك تستحق الأفضل.", en: "We deliver car wash and polishing services with the highest standards of quality and professionalism. Your car deserves excellence." },
    "hero.explore": { ar: "استكشف الخدمات", en: "Explore services" },
    "hero.clients": { ar: "عميل سعيد", en: "Happy Clients" },
    "hero.years": { ar: "سنوات خبرة", en: "Years Experience" },
    "hero.guaranteed": { ar: "ضمان الجودة", en: "Guaranteed" },
    "hero.rating": { ar: "تقييم العملاء", en: "Client Rating" },
    "hero.premium": { ar: "خدمة متميزة", en: "Premium Service" },
    "feat.fast": { ar: "سرعة فائقة", en: "Lightning Fast" },
    "feat.fast.d": { ar: "نحترم وقتك — خدمة سريعة دون المساس بالجودة.", en: "We respect your time — fast service without compromise." },
    "feat.quality": { ar: "جودة استثنائية", en: "Premium Quality" },
    "feat.quality.d": { ar: "منتجات ألمانية عالية الجودة ومعدات احترافية.", en: "Top-grade German products and professional equipment." },
    "feat.guarantee": { ar: "ضمان الرضا", en: "Satisfaction Guaranteed" },
    "feat.guarantee.d": { ar: "لست راضياً؟ نعيد الخدمة مجاناً.", en: "Not satisfied? We redo the service for free." },
    "feat.eco": { ar: "صديق للبيئة", en: "Eco-Friendly" },
    "feat.eco.d": { ar: "منتجات آمنة بيئياً وأنظمة توفير المياه.", en: "Eco-safe products and water-saving systems." },
    "cta.heading": { ar: "احجز موعدك الآن", en: "Book your slot now" },
    "cta.sub": { ar: "خطوات بسيطة وسريعة — أقل من دقيقة.", en: "Simple and fast booking in under a minute." },
    "services.label": { ar: "خدماتنا", en: "Our Services" },
    "services.heading": { ar: "الخدمات التي نقدمها", en: "What we offer" },
    "services.sub": { ar: "ثلاث باقات متميزة تناسب احتياجاتك.", en: "Three premium packages for every need." },
    "services.popular": { ar: "الأكثر طلباً", en: "POPULAR" },
    "services.basic": { ar: "BASIC", en: "BASIC" },
    "services.pro": { ar: "PREMIUM", en: "PREMIUM" },
    "services.book": { ar: "احجز الآن", en: "Book now" },
    "booking.label": { ar: "احجز موعدك", en: "Book Appointment" },
    "booking.heading": { ar: "احجز موعدك الآن", en: "Book your appointment" },
    "booking.sub": { ar: "خطوات بسيطة وسريعة في دقائق.", en: "Simple and fast booking in minutes." },
    "booking.details": { ar: "بيانات الحجز", en: "Booking Details" },
    "booking.selectService": { ar: "اختر الخدمة", en: "Select service" },
    "booking.fullName": { ar: "الاسم الكامل", en: "Full Name" },
    "booking.phone": { ar: "رقم الهاتف", en: "Phone" },
    "booking.carType": { ar: "نوع السيارة", en: "Car Type" },
    "booking.color": { ar: "لون السيارة", en: "Color" },
    "booking.notes": { ar: "ملاحظات", en: "Notes" },
    "booking.selectDate": { ar: "اختر التاريخ", en: "Select date" },
    "booking.selectTime": { ar: "اختر وقت الموعد", en: "Select time" },
    "booking.available": { ar: "متاح", en: "available" },
    "booking.full": { ar: "ممتلئ", en: "Full" },
    "booking.confirm": { ar: "تأكيد الحجز", en: "Confirm Booking" },
    "booking.success": { ar: "تم الحجز بنجاح!", en: "Booked successfully!" },
    "booking.yours": { ar: "حجوزاتك", en: "Your Bookings" },
    "booking.empty": { ar: "لا توجد حجوزات بعد", en: "No bookings yet" },
    "booking.cancel": { ar: "إلغاء", en: "Cancel" },
    "booking.cancelled": { ar: "تم إلغاء الحجز", en: "Booking cancelled" },
    "booking.loginRequired": { ar: "يجب تسجيل الدخول لإتمام الحجز", en: "Please sign in to complete your booking" },
    "booking.closed": { ar: "مغلق", en: "Closed" },
    "reviews.label": { ar: "آراء العملاء", en: "Client Reviews" },
    "reviews.heading": { ar: "ماذا يقول عملاؤنا", en: "What our clients say" },
    "reviews.empty": { ar: "لا توجد آراء منشورة بعد.", en: "No published reviews yet." },
    "login.title": { ar: "تسجيل الدخول", en: "Sign in" },
    "login.signup": { ar: "إنشاء حساب", en: "Create account" },
    "login.email": { ar: "البريد الإلكتروني", en: "Email" },
    "login.password": { ar: "كلمة المرور", en: "Password" },
    "login.name": { ar: "الاسم الكامل", en: "Full Name" },
    "login.phone": { ar: "رقم الهاتف", en: "Phone (optional)" },
    "login.google": { ar: "المتابعة باستخدام Google", en: "Continue with Google" },
    "login.or": { ar: "أو", en: "or" },
    "login.haveAccount": { ar: "لديك حساب؟ سجل الدخول", en: "Have an account? Sign in" },
    "login.noAccount": { ar: "ليس لديك حساب؟ سجل الآن", en: "No account? Sign up" },
    "login.welcome": { ar: "مرحباً بعودتك", en: "Welcome back" },
    "login.checkEmail": { ar: "تحقق من بريدك الإلكتروني لتأكيد الحساب", en: "Check your email to confirm your account" },
    "admin.title": { ar: "لوحة الإدارة", en: "Admin Dashboard" },
    "admin.bookings": { ar: "جميع الحجوزات", en: "All Bookings" },
    "admin.services": { ar: "الخدمات", en: "Services" },
    "admin.closedDays": { ar: "الأيام المغلقة", en: "Closed Days" },
    "admin.totalBookings": { ar: "إجمالي الحجوزات", en: "Total Bookings" },
    "admin.todayBookings": { ar: "حجوزات اليوم", en: "Today's Bookings" },
    "admin.revenue": { ar: "الإيرادات", en: "Revenue" },
    "admin.pending": { ar: "في الانتظار", en: "Pending" },
    "admin.confirmed": { ar: "مؤكد", en: "Confirmed" },
    "admin.completed": { ar: "مكتمل", en: "Completed" },
    "admin.cancelled": { ar: "ملغي", en: "Cancelled" },
    "admin.notAdmin": { ar: "هذه الصفحة للمسؤولين فقط", en: "This page is for admins only" },
    "admin.addClosed": { ar: "إغلاق هذا اليوم", en: "Close this day" },
    "common.price": { ar: "السعر", en: "Price" },
    "common.date": { ar: "التاريخ", en: "Date" },
    "common.time": { ar: "الوقت", en: "Time" },
    "common.status": { ar: "الحالة", en: "Status" },
    "common.customer": { ar: "العميل", en: "Customer" },
    "common.service": { ar: "الخدمة", en: "Service" },
    "common.action": { ar: "إجراء", en: "Action" },
    "common.delete": { ar: "حذف", en: "Delete" },
    "common.loading": { ar: "جاري التحميل...", en: "Loading..." },
    "footer.rights": { ar: "© 2025 مغسلة البرنس. جميع الحقوق محفوظة.", en: "© 2025 Al-Prince Car Wash. All rights reserved." },
};

type I18nContextType = {
    lang: Lang;
    dir: "rtl" | "ltr";
    setLang: (l: Lang) => void;
    toggle: () => void;
    tr: (k: string) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>("ar");

    useEffect(() => {
        const stored = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
        if (stored === "ar" || stored === "en") setLangState(stored);
    }, []);

    const dir = lang === "ar" ? "rtl" : "ltr";

    useEffect(() => {
        if (typeof document !== "undefined") {
            document.documentElement.lang = lang;
            document.documentElement.dir = dir;
        }
    }, [lang, dir]);

    const setLang = (l: Lang) => {
        setLangState(l);
        if (typeof window !== "undefined") localStorage.setItem("lang", l);
    };

    const tr = (k: string) => t[k]?.[lang] ?? k;

    return (
        <I18nContext.Provider value={{ lang, dir, setLang, toggle: () => setLang(lang === "ar" ? "en" : "ar"), tr }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
    return ctx;
}

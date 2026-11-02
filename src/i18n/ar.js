// Static UI text — Arabic. Keys mirror src/i18n/en.js; a missing key falls back to English.
const ar = {
  meta: {
    // Shown only until the Profile sheet loads; the sheet's name_ar (if any) replaces it
    site: "Rasha Al Haj Hasan",
    pages: {
      home: "مطوّرة برمجيات",
      projects: "المشاريع",
      experience: "الخبرات",
      about: "نبذة عني",
      skills: "المهارات",
      contact: "التواصل",
      notFound: "الصفحة غير موجودة",
    },
  },

  nav: {
    home: "الرئيسية",
    projects: "المشاريع",
    experience: "الخبرات",
    about: "نبذة عني",
    skills: "المهارات",
    contact: "التواصل",
    main: "التنقل الرئيسي",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    menu: "القائمة",
    skip: "الانتقال إلى المحتوى",
    cta: "تواصل معي",
  },

  prefs: {
    language: "اللغة",
    theme: {
      toDark: "التبديل إلى الوضع الداكن",
      toLight: "التبديل إلى الوضع الفاتح",
    },
  },

  common: {
    loading: "جارٍ التحميل…",
    viewAll: "عرض الكل",
    backToTop: "العودة إلى الأعلى",
    rights: "جميع الحقوق محفوظة.",
    portfolio: "معرض الأعمال",
  },

  home: {
    label: "معرض الأعمال",
    script: "أعمال مختارة",
    rolesFallback: "مطوّرة برمجيات",
    introFallback: "برمجيات للويب والهاتف وأنظمة الأعمال، مصمّمة بعناية لمن يستخدمها.",
    ctaProjects: "عرض المشاريع",
    ctaContact: "تواصل معي",
    stats: "لمحة سريعة",
    sections: {
      about: "تعريف",
      projects: "مشاريع مختارة",
      experience: "الخبرات",
      skills: "المهارات",
      contact: "التواصل",
    },
    about: {
      more: "المزيد عني",
    },
    projects: {
      all: "كل المشاريع",
    },
    experience: {
      more: "كل الخبرات",
      empty: "تجد الأدوار والمسؤوليات في صفحة الخبرات.",
    },
    skills: {
      more: "كل المهارات",
    },
    contact: {
      script: "لنعمل معًا",
      text: "متاحة للعمل الحر والأدوار في تطوير المنتجات والتعاون في مشاريع برمجية.",
      cta: "تواصل معي",
      email: "أرسل بريدًا إلكترونيًا",
    },
  },

  showcase: {
    summary: "مطوّرة تطبيقات هاتف وويب وبرمجيات — أعمل بـ Flutter و C# و .NET.",
  },

  projects: {
    label: "الأعمال",
    title: "المشاريع",
    script: "مختارة",
    intro: "مجموعة من مشاريع الويب والهاتف وأنظمة الأعمال، مع المشكلة التي يحلّها كل مشروع والتقنيات المستخدمة فيه.",
    count: "{n} مشاريع",
    countOne: "مشروع واحد",
    filter: "تصفية المشاريع حسب التقنية",
    all: "الكل",
    featured: "مميّز",
    noMatch: "لا توجد مشاريع تستخدم هذه التقنية بعد.",
    viewProject: "عرض المشروع",
    github: "GitHub",
    viewScreens: "عرض الشاشات",
    screens: "{n} شاشات",
    openScreens: "فتح لقطات شاشة {title}",
    noScreens: "الشاشات قريبًا",
    loading: "جارٍ تحميل المشاريع",
    errorTitle: "تعذّر تحميل المشاريع",
    errorText: "تحقّق من الاتصال ثم أعد تحميل الصفحة.",
    emptyTitle: "لا توجد مشاريع بعد",
    emptyText: "ستظهر هنا المشاريع المضافة إلى جدول البيانات.",
    platforms: {
      web: "تطبيق ويب",
      mobile: "تطبيق هاتف",
      website: "موقع ويب",
    },
  },

  viewer: {
    dialog: "لقطات شاشة {title}",
    close: "إغلاق لقطات الشاشة",
    prev: "اللقطة السابقة",
    next: "اللقطة التالية",
    position: "{i} من {n}",
    alt: "{title} — لقطة الشاشة {i}",
    unavailable: "هذه الصورة غير متاحة.",
  },

  experience: {
    label: "المسيرة المهنية",
    title: "الخبرات",
    script: "المسيرة",
    intro: "الأدوار والمسؤوليات والتقنيات التي استخدمتها على طول الطريق.",
    loading: "جارٍ تحميل الخبرات",
    emptyTitle: "يجري تحديث الخبرات",
    emptyText: "ستظهر هنا الأدوار المضافة إلى جدول البيانات.",
    technologies: "التقنيات",
    at: "لدى",
  },

  about: {
    label: "نبذة",
    title: "نبذة عني",
    script: "تعريف",
    loading: "جارٍ تحميل المعلومات",
    emptyTitle: "لا يوجد محتوى بعد",
    emptyText: "ستظهر هنا التفاصيل المضافة إلى جدول البيانات.",
    intro: "تعريف",
    glance: "لمحة سريعة",
    background: "التعليم والخلفية",
    expertise: "مجالات الخبرة",
    next: "تابع القراءة",
    toSkills: "المهارات",
    toExperience: "الخبرات",
  },

  skills: {
    label: "القدرات",
    title: "المهارات",
    script: "الأدوات",
    intro: "التقنيات والممارسات التي أعمل بها، مصنّفة حسب المجال.",
    loading: "جارٍ تحميل المهارات",
    emptyTitle: "يجري تحديث المهارات",
    emptyText: "ستظهر هنا المهارات المضافة إلى جدول البيانات.",
    groups: {
      backend: "تطوير الواجهات الخلفية",
      mobile: "تطوير تطبيقات الهاتف",
      frontend: "تطوير الواجهات الأمامية",
      databases: "قواعد البيانات",
      erp: "أنظمة ERP والأعمال",
      tools: "أدوات التطوير",
      other: "مهارات أخرى",
    },
  },

  contact: {
    label: "التواصل",
    title: "لنتحدّث",
    script: "مرحبًا",
    intro: "متاحة للعمل الحر والأدوار في تطوير المنتجات والتعاون في مشاريع برمجية. اختر القناة التي تناسبك.",
    loading: "جارٍ تحميل بيانات التواصل",
    emptyTitle: "يجري تحديث بيانات التواصل",
    emptyText: "في الأثناء، يمكنك الاطلاع على أعمالي في صفحة المشاريع.",
    email: "البريد الإلكتروني",
    sendEmail: "إرسال بريد",
    copy: "نسخ البريد",
    copied: "تم النسخ",
    channels: "قنوات أخرى",
    types: {
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      whatsapp: "واتساب",
      linkedin: "لينكدإن",
      github: "GitHub",
      location: "الموقع",
    },
    open: "فتح {label}",
  },

  notFound: {
    label: "خطأ 404",
    title: "الصفحة غير موجودة",
    text: "هذا العنوان لا يطابق أي صفحة. تحقّق من الرابط أو عُد إلى الصفحة الرئيسية.",
    home: "العودة إلى الرئيسية",
  },
};

export default ar;

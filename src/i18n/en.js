// Static UI text — English. Keys mirror src/i18n/ar.js.
// Portfolio content (projects, experience, …) comes from Google Sheets, not from here.
const en = {
  meta: {
    site: "Rasha Al Haj Hasan",
    pages: {
      home: "Software Developer",
      projects: "Projects",
      experience: "Experience",
      about: "About",
      skills: "Skills",
      contact: "Contact",
      notFound: "Page not found",
    },
  },

  nav: {
    home: "Home",
    projects: "Projects",
    experience: "Experience",
    about: "About",
    skills: "Skills",
    contact: "Contact",
    main: "Main",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menu: "Menu",
    skip: "Skip to content",
    cta: "Get in touch",
  },

  prefs: {
    language: "Language",
    theme: {
      toDark: "Switch to dark theme",
      toLight: "Switch to light theme",
    },
  },

  common: {
    loading: "Loading…",
    viewAll: "View all",
    backToTop: "Back to top",
    rights: "All rights reserved.",
    portfolio: "Portfolio",
  },

  home: {
    label: "Portfolio",
    script: "selected work",
    rolesFallback: "Software Developer",
    introFallback: "Web, mobile and business software built with care for the people who use it.",
    ctaProjects: "View projects",
    ctaContact: "Contact me",
    stats: "At a glance",
    sections: {
      about: "Introduction",
      projects: "Selected projects",
      experience: "Experience",
      skills: "Skills",
      contact: "Contact",
    },
    about: {
      more: "More about me",
    },
    projects: {
      all: "All projects",
    },
    experience: {
      more: "Full experience",
      empty: "Roles and responsibilities are listed on the Experience page.",
    },
    skills: {
      more: "All skills",
    },
    contact: {
      script: "Let’s work together",
      text: "Open to freelance work, product roles and software collaborations.",
      cta: "Contact me",
      email: "Send an email",
    },
  },

  showcase: {
    summary: "Mobile, web and software developer — building with Flutter, C# and .NET.",
  },

  projects: {
    label: "Work",
    title: "Projects",
    script: "selected",
    intro: "A selection of web, mobile and business projects, with the problem each one solves and the technology behind it.",
    count: "{n} projects",
    countOne: "1 project",
    filter: "Filter projects by technology",
    all: "All",
    featured: "Featured",
    noMatch: "No projects use this technology yet.",
    viewProject: "View project",
    github: "GitHub",
    viewScreens: "View screens",
    screens: "{n} screens",
    openScreens: "Open {title} screenshots",
    noScreens: "Screens coming soon",
    loading: "Loading projects",
    errorTitle: "Projects couldn’t load",
    errorText: "Check your connection, then reload the page.",
    emptyTitle: "No projects yet",
    emptyText: "Projects added to the spreadsheet will appear here.",
    platforms: {
      web: "Web application",
      mobile: "Mobile application",
      website: "Website",
    },
  },

  viewer: {
    dialog: "{title} screenshots",
    close: "Close screenshots",
    prev: "Previous screenshot",
    next: "Next screenshot",
    position: "{i} of {n}",
    alt: "{title} screenshot {i}",
    unavailable: "This image is unavailable.",
  },

  experience: {
    label: "Career",
    title: "Experience",
    script: "path",
    intro: "Roles, responsibilities and the technology used along the way.",
    loading: "Loading experience",
    emptyTitle: "Experience is being updated",
    emptyText: "Roles added to the spreadsheet will appear here.",
    technologies: "Technologies",
    at: "at",
  },

  about: {
    label: "About",
    title: "About me",
    script: "introduction",
    loading: "Loading about information",
    emptyTitle: "Nothing here yet",
    emptyText: "About details added to the spreadsheet will appear here.",
    intro: "Introduction",
    glance: "At a glance",
    background: "Education & background",
    expertise: "Areas of expertise",
    next: "Continue",
    toSkills: "Skills",
    toExperience: "Experience",
  },

  skills: {
    label: "Capabilities",
    title: "Skills",
    script: "toolkit",
    intro: "Technologies and practices I work with, grouped by area.",
    loading: "Loading skills",
    emptyTitle: "Skills are being updated",
    emptyText: "Skills added to the spreadsheet will appear here.",
    groups: {
      backend: "Backend development",
      mobile: "Mobile development",
      frontend: "Frontend development",
      databases: "Databases",
      erp: "ERP & business systems",
      tools: "Development tools",
      other: "Other skills",
    },
  },

  contact: {
    label: "Contact",
    title: "Let’s talk",
    script: "hello",
    intro: "Open to freelance work, product roles and software collaborations. Choose whichever channel suits you.",
    loading: "Loading contact details",
    emptyTitle: "Contact details are being updated",
    emptyText: "In the meantime, you can find my work on the Projects page.",
    email: "Email",
    sendEmail: "Send email",
    copy: "Copy email",
    copied: "Copied",
    channels: "Other channels",
    types: {
      email: "Email",
      phone: "Phone",
      whatsapp: "WhatsApp",
      linkedin: "LinkedIn",
      github: "GitHub",
      location: "Location",
    },
    open: "Open {label}",
  },

  notFound: {
    label: "Error 404",
    title: "Page not found",
    text: "This address doesn’t match any page. Check the link, or head back to the homepage.",
    home: "Back to home",
  },
};

export default en;

// Static UI text.
// Portfolio content (projects, experience, …) comes from Google Sheets, not from here.
const TEXT = {
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
      text: "Feel free to get in touch for professional inquiries.",
      cta: "Contact me",
      email: "Send an Email",
      linkedin: "View LinkedIn",
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
    label: "Get in touch",
    title: "Contact",
    script: "details",
    intro: "Feel free to get in touch for professional inquiries.",
    loading: "Loading contact details",
    emptyTitle: "Contact details are being updated",
    emptyText: "In the meantime, you can find my work on the Projects page.",
    email: "Email",
    sendEmail: "Send an Email",
    copy: "Copy email",
    copied: "Copied",
    details: "Contact details",
    open: "Open {label}",
  },

  notFound: {
    label: "Error 404",
    title: "Page not found",
    text: "This address doesn’t match any page. Check the link, or head back to the homepage.",
    home: "Back to home",
  },
};

// t("projects.count", { n: 3 }) — unknown keys fall back to the key itself
export function t(key, vars) {
  const text = key.split(".").reduce((node, part) => node?.[part], TEXT) ?? key;
  if (!vars || typeof text !== "string") return text;
  return text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
}

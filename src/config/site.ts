export const siteConfig = {
  title: "Great Seattle Life Hacks",
  author: "LifeHacker",
  url: "https://lifehacks.zeey-app.net",
  description: `Your Gateway to Seattle's Best`,
  tagline: "Discover. Explore. Thrive.",

  navbarEntries: [
    { title: "About", url: "/about" },
    { title: "Facebook", url: "https://www.facebook.com/profile.php?id=61551909728667" },
    { title: "Subscribe", url: "/subscribe" },
  ],

  // Full-page scrollable sections (SpaceX-style)
  heroSections: [
    {
      id: "overview",
      title: "Great Seattle Life Hacks",
      subtitle: "Your Gateway to Seattle's Best",
      description: "Your go-to source for the latest tech articles, tutorials, and insights to fuel your learning journey. Plus, discover handpicked local recommendations — from trusted services to hidden gems around Seattle.",
      backgroundImage: "/images/seattle-skyline.jpg",
      navButtons: [
        { label: "Life Saver Tools", scrollTo: "tools" },
        { label: "Space Tech", scrollTo: "space" },
        { label: "AI Techs", scrollTo: "tech" },
      ],
    },
    {
      id: "tools",
      title: "Life Saver Tools",
      subtitle: "Little Things That Make Life Easier",
      description: "Printable calendars, handy everyday tools, and our favorite local spots — because the best life hacks are the ones that just work.",
      url: "/tools",
      backgroundGradient: "from-rose-900 via-amber-900 to-orange-950",
    },
    {
      id: "space",
      title: "Space Tech",
      subtitle: "Beyond Our World",
      description: "Track the latest rocket launches, space missions, and breakthrough discoveries from around the globe.",
      url: "/space",
      backgroundGradient: "from-slate-900 via-purple-900 to-indigo-900",
    },
    {
      id: "tech",
      title: "AI Techs",
      subtitle: "Stay Ahead of the Curve",
      description: "Explore cutting-edge technology articles, tutorials, and insights for everyday learning and professional growth.",
      url: "/tech",
      backgroundGradient: "from-blue-900 via-indigo-900 to-slate-900",
    },
  ],

  footerEntries: [
    { title: "Life Saver Tools", url: "/tools" },
    { title: "Space", url: "/space" },
    { title: "AI Techs", url: "/tech" },
    { title: "Facebook", url: "https://www.facebook.com/profile.php?id=61551909728667" },
    { title: "Subscribe", url: "/subscribe" },
  ],

  sectionTitles: {
    projects: "Information and Recommendations",
    misc: "Details",
    blog: "Blog",
  }
};

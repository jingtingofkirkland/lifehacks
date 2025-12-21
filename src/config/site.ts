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
        { label: "AI Techs", scrollTo: "tech" },
        { label: "Space Tech", scrollTo: "space" },
        { label: "Local Gems", scrollTo: "local" },
      ],
    },
    {
      id: "tech",
      title: "AI Techs",
      subtitle: "Stay Ahead of the Curve",
      description: "Explore cutting-edge technology articles, tutorials, and insights for everyday learning and professional growth.",
      url: "/tech",
      backgroundGradient: "from-blue-900 via-indigo-900 to-slate-900",
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
      id: "local",
      title: "Local Recommendations",
      subtitle: "Seattle's Hidden Gems",
      description: "Handpicked local businesses, restaurants, and services that make the Emerald City truly special.",
      url: "/business",
      backgroundGradient: "from-emerald-900 via-teal-900 to-slate-900",
    },
  ],

  footerEntries: [
    { title: "AI Techs", url: "/tech" },
    { title: "Space", url: "/space" },
    { title: "Recommendations", url: "/business" },
    { title: "Facebook", url: "https://www.facebook.com/profile.php?id=61551909728667" },
    { title: "Subscribe", url: "/subscribe" },
  ],

  sectionTitles: {
    projects: "Information and Recommendations",
    misc: "Details",
    blog: "Blog",
  }
};

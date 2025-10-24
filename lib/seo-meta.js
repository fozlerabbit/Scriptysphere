// Static meta tag configurations - NO build process needed
export const metaConfigs = {
  home: {
    title: "ScriptySphere - Youth-Led Social Impact Through Technology",
    description: "Empowering communities through technology education, sustainable solutions, and youth leadership. Join 50,000+ learners across 25 countries building a progressive future.",
    canonical: "/",
    image: "/assets/images/og-home.jpg",
    keywords: ["youth technology", "digital literacy Bangladesh", "social impact NGO"]
  },
  about: {
    title: "About Us - Our Mission, Vision & Team",
    description: "Founded in 2019, ScriptySphere is a youth-led organization dedicated to bridging the digital divide through education, innovation, and community empowerment.",
    canonical: "/about",
    image: "/assets/images/og-about.jpg",
    keywords: ["youth NGO Bangladesh", "technology education", "social impact"]
  },
  programs: {
    title: "Our Programs - Digital Literacy, Green Tech & Leadership",
    description: "Explore ScriptySphere's impact programs: Digital Literacy Initiative (50,000+ trained), Sustainable Technology Solutions (45 communities), Women in Tech.",
    canonical: "/programs",
    image: "/assets/images/og-programs.jpg",
    keywords: ["digital literacy program", "sustainable technology", "youth leadership"]
  },
  blog: {
    title: "Blog - Technology, Education & Social Impact Insights",
    description: "Expert articles on youth technology education, sustainable development, and social innovation from ScriptySphere's team and partners.",
    canonical: "/blog",
    image: "/assets/images/og-blog.jpg",
    keywords: ["technology blog", "social impact", "youth development"]
  },
  member: {
    title: "Our Members - Meet the Youth Changemakers",
    description: "Meet the passionate young leaders, developers, educators, and innovators driving ScriptySphere's mission across Bangladesh and beyond.",
    canonical: "/member",
    image: "/assets/images/og-members.jpg",
    keywords: ["youth leaders", "technology volunteers", "changemakers"]
  }
};

export function getMetaTags(pageKey) {
  const config = metaConfigs[pageKey];
  const baseURL = "https://www.scriptysphere.org";
  
  return `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title}</title>
    <meta name="description" content="${config.description}">
    <meta name="keywords" content="${config.keywords.join(', ')}">
    <link rel="canonical" href="${baseURL}${config.canonical}">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${baseURL}${config.canonical}">
    <meta property="og:title" content="${config.title}">
    <meta property="og:description" content="${config.description}">
    <meta property="og:image" content="${baseURL}${config.image}">
    <meta property="og:site_name" content="ScriptySphere">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${baseURL}${config.canonical}">
    <meta name="twitter:title" content="${config.title}">
    <meta name="twitter:description" content="${config.description}">
    <meta name="twitter:image" content="${baseURL}${config.image}">
    
    <!-- Robots -->
    <meta name="robots" content="index, follow, max-image-preview:large">
  `;
}

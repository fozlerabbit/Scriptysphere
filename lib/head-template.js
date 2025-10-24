// Shared head configuration
export const headConfig = {
  baseURL: 'https://www.scriptysphere.org',
  siteName: 'ScriptySphere',
  twitterHandle: '@ScriptySphere',
  
  // Common meta tags for all pages
  common: `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/assets/images/icons/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/icons/favicon-32x32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/icons/apple-touch-icon.png">
    
    <!-- Preconnect to external domains -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdn.tailwindcss.com">
    
    
    <!-- Robots -->
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="googlebot" content="index, follow">
  `,
  
  // Page-specific configurations
  pages: {
    home: {
      title: 'ScriptySphere - Youth-Led Social Impact Through Technology',
      description: 'Empowering communities through technology education, sustainable solutions, and youth leadership. Join 50,000+ learners across 25 countries building a progressive future.',
      canonical: '/',
      image: '/assets/images/og-home.jpg',
      keywords: 'youth technology, digital literacy Bangladesh, social impact NGO, STEM education',
      type: 'website'
    },
    about: {
      title: 'About Us - Our Mission, Vision & Team | ScriptySphere',
      description: 'Founded in 2019, ScriptySphere is a youth-led organization dedicated to bridging the digital divide through education, innovation, and community empowerment.',
      canonical: '/about',
      image: '/assets/images/og-about.jpg',
      keywords: 'youth NGO Bangladesh, technology education, social impact organization',
      type: 'website'
    },
    programs: {
      title: 'Our Programs - Digital Literacy, Green Tech & Leadership | ScriptySphere',
      description: 'Explore ScriptySphere\'s impact programs: Digital Literacy Initiative (50,000+ trained), Sustainable Technology Solutions (45 communities), Women in Tech.',
      canonical: '/programs',
      image: '/assets/images/og-programs.jpg',
      keywords: 'digital literacy program, sustainable technology, youth leadership training',
      type: 'website'
    },
    blog: {
      title: 'Blog - Technology, Education & Social Impact Insights | ScriptySphere',
      description: 'Expert articles on youth technology education, sustainable development, and social innovation from ScriptySphere\'s team and partners.',
      canonical: '/blog',
      image: '/assets/images/og-blog.jpg',
      keywords: 'technology blog, social impact, youth development',
      type: 'website'
    },
    member: {
      title: 'Our Members - Meet the Youth Changemakers | ScriptySphere',
      description: 'Meet the passionate young leaders, developers, educators, and innovators driving ScriptySphere\'s mission across Bangladesh and beyond.',
      canonical: '/member',
      image: '/assets/images/og-members.jpg',
      keywords: 'youth leaders, technology volunteers, changemakers',
      type: 'website'
    }
  },
  
  // Organization structured data (same for all pages)
  structuredData: {
    organization: {
      "@context": "https://schema.org",
      "@type": "NGO",
      "@id": "https://www.scriptysphere.org/#organization",
      "name": "ScriptySphere",
      "url": "https://www.scriptysphere.org",
      "logo": "https://www.scriptysphere.org/assets/img/logo.webp",
      "description": "Youth-led organization building a progressive nation through technology, education, and social development",
      "email": "ScriptySphere@gmail.com",
      "telephone": "+880-1600-374396",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dhaka",
        "addressRegion": "Dhaka Division",
        "addressCountry": "BD"
      },
      "foundingDate": "2019",
      "sameAs": [
        "https://facebook.com/scriptysphere",
        "https://linkedin.com/company/scriptysphere"
      ]
    },
    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "ScriptySphere",
      "url": "https://www.scriptysphere.org",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.scriptysphere.org/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  }
};

// Generate complete head HTML
export function generateHead(pageKey) {
  const page = headConfig.pages[pageKey];
  const fullURL = `${headConfig.baseURL}${page.canonical}`;
  const fullImageURL = page.image.startsWith('http') 
    ? page.image 
    : `${headConfig.baseURL}${page.image}`;
  
  return `
    ${headConfig.common}
    
    <!-- Page-specific Meta Tags -->
    <title>${page.title}</title>
    <meta name="description" content="${page.description}">
    <meta name="keywords" content="${page.keywords}">
    <link rel="canonical" href="${fullURL}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${page.type}">
    <meta property="og:url" content="${fullURL}">
    <meta property="og:title" content="${page.title}">
    <meta property="og:description" content="${page.description}">
    <meta property="og:image" content="${fullImageURL}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="${headConfig.siteName}">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${fullURL}">
    <meta name="twitter:title" content="${page.title}">
    <meta name="twitter:description" content="${page.description}">
    <meta name="twitter:image" content="${fullImageURL}">
    <meta name="twitter:site" content="${headConfig.twitterHandle}">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        ${JSON.stringify(headConfig.structuredData.organization)},
        ${JSON.stringify(headConfig.structuredData.website)}
      ]
    }
    </script>
  `;
}

// Auto-inject head content based on data attribute
document.addEventListener('DOMContentLoaded', () => {
  const headElement = document.querySelector('head[data-page]');
  if (headElement) {
    const pageKey = headElement.getAttribute('data-page');
    const headHTML = generateHead(pageKey);
    headElement.insertAdjacentHTML('beforeend', headHTML);
  }
});

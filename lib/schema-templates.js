// Static structured data - works without build process
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "NGO",
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
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ScriptySphere",
  "url": "https://www.scriptysphere.org",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.scriptysphere.org/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const homeFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is ScriptySphere?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ScriptySphere is a youth-led organization that empowers communities through technology education, sustainable solutions, and social innovation. We've trained over 50,000 people across 25 countries in digital literacy, coding, and green technology."
      }
    },
    {
      "@type": "Question",
      "name": "How can I join ScriptySphere?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can join ScriptySphere by visiting scriptysphere.org/join and filling out our membership form. We welcome youth passionate about technology, education, and social impact from all backgrounds."
      }
    },
    {
      "@type": "Question",
      "name": "What programs does ScriptySphere offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer Digital Literacy Initiative, Sustainable Technology Solutions, Women in Tech programs, Innovation Labs, and Youth Leadership training across Bangladesh and 24 partner countries."
      }
    }
  ]
};

// Load navbar.html dynamically
function loadNavbar() {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");
  
    fetch("nav.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load navbar");
        }
        return response.text();
      })
      .then((html) => {
        navbarPlaceholder.innerHTML = html;
        highlightActiveLink(); // Highlight the active page after loading the navbar
      })
      .catch((error) => console.error("Error loading navbar:", error));
  }
  
  // Highlight the active link based on the current URL
  function highlightActiveLink() {
    const currentPath = window.location.pathname.split("/").pop(); // Get current file name
    const links = document.querySelectorAll("nav a");
  
    links.forEach((link) => {
      if (link.getAttribute("href") === currentPath || (currentPath === "" && link.getAttribute("href") === "index.html")) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }
  
  
  // Load the navbar after DOM content is loaded
  document.addEventListener("DOMContentLoaded", loadNavbar);
  // Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Get the current URL of the page
    const currentURL = window.location.href;
  
    // Select all navigation links inside the navbar
    const navLinks = document.querySelectorAll("#nav-menu a");
  
    // Loop through each link
    navLinks.forEach((link) => {
      // If the link's href matches the current URL, add the 'active' class
      if (currentURL.includes(link.href)) {
        link.classList.add("active");
      } else {
        // Remove 'active' class from other links
        link.classList.remove("active");
      }
    });
  });
  
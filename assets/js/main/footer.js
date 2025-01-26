// Function to load footer.html into a placeholder
function loadFooter() {
    const footerPlaceholder = document.getElementById("footer-placeholder");
  
    fetch("footer.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((html) => {
        footerPlaceholder.innerHTML = html;
      })
      .catch((error) => {
        console.error("Error loading footer:", error);
      });
  }
  
  // Load the footer after DOM content is loaded
  document.addEventListener("DOMContentLoaded", loadFooter);
  
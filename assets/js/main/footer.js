// Use an IIFE to avoid polluting the global scope
(() => {
  // Async function for better error handling
  const loadFooter = async () => {
      const footerPlaceholder = document.getElementById('footer-placeholder');
      
      // Early exit if placeholder doesn't exist
      if (!footerPlaceholder) {
          console.error('Footer placeholder element not found');
          return;
      }

      try {
          const response = await fetch('footer.html');
          
          // Check for valid HTTP response
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          // Parse response as text
          const footerContent = await response.text();
          
          // Sanitize content here if needed (consider using DOMPurify)
          footerPlaceholder.innerHTML = footerContent;

      } catch (error) {
          console.error('Failed to load footer:', error);
          // Provide fallback content
          footerPlaceholder.innerHTML = `
              <footer class="footer-error">
                  Footer content failed to load - ${new Date().toLocaleDateString()}
              </footer>
          `;
      }
  };

  // Use event listener with error handling
  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadFooter);
  } else {
      loadFooter(); // Already loaded
  }
})();
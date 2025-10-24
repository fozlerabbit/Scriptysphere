const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav_links");
const navLink = document.querySelectorAll(".nav-link");
const contactLink = document.querySelector(".link");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
  contactLink.classList.toggle("active");
});

navLink.forEach((n) =>
  n.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    contactLink.classList.toggle("active");
  })
);

contactLink.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  contactLink.classList.toggle("active");
});

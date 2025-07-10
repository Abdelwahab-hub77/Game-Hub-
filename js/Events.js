
"use strict";

export class Events {
  constructor(navbarNav, navbar, closeBtn, scrollableDiv, display) {
    this.navbarNav = navbarNav;
    this.navbar = navbar;
    this.closeBtn = closeBtn;
    this.scrollableDiv = scrollableDiv;
    this.display = display;
  }

  registerEvents(categoryChangeCallback) {
    this.handleNavClick(categoryChangeCallback);
    this.handleCloseDetails();
    this.handleScroll();
  }

  handleNavClick(categoryChangeCallback) {
    this.navbarNav.addEventListener("click", (event) => {
      const clickedLink = event.target.closest(".nav-link");
      if (clickedLink) {
        event.preventDefault();
        const currentActive = this.navbarNav.querySelector(".nav-link.active");
        if (currentActive !== clickedLink) currentActive?.classList.remove("active");
        clickedLink.classList.add("active");

        const category = clickedLink.dataset.category;
        categoryChangeCallback(category);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  handleCloseDetails() {
    this.closeBtn.addEventListener("click", () => this.display.hideDetailsBox());
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.display.hideDetailsBox();
    });
  }

  handleScroll() {
    const offsetTopValue = this.scrollableDiv.offsetTop;
    window.addEventListener("scroll", () => {
      if (window.scrollY >= offsetTopValue) {
        this.navbar.classList.add("fixed-top", "mt-0");
        this.navbar.classList.remove("mt-5");
      } else {
        this.navbar.classList.remove("fixed-top", "mt-0");
        this.navbar.classList.add("mt-5");
      }
    });
  }
}
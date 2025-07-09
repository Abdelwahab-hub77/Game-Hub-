"use strict";

// Class to handle the whole game app logic
class GameApp {
  constructor() {
    // Navbar links container
    this.navbarNav = document.querySelector(".navbar-nav");

    // Loader element (for showing while fetching data)
    this.loader = document.querySelector(".loader-box");

    // Game details container (shows single game info)
    this.bigBox = document.querySelector(".big-box");

    // Close button inside the game details box
    this.closeBtn = document.querySelector("#close");

    // Container to display game cards
    this.gameCardsContainer = document.querySelector(".displayGame");

    // Navbar element
    this.navbar = document.querySelector(".navbar");

    // Placeholder element to calculate scroll offset
    this.scrollableDiv = document.getElementById("myScrollableDiv");
    this.offsetTopValue = this.scrollableDiv.offsetTop;

    // To store fetched game data
    this.gameInfo = [];

    // API config (RapidAPI headers)
    this.apiOptions = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "9923ce835dmsh894b2cee03a15cbp14a8b8jsn771770093da3",
        "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
      },
    };
  }

  // Initialization method to run all app functionality
  init() {
    this.handleNavClick(); // Handle navbar category click
    this.handleCloseDetails(); // Handle closing of game detail view
    this.handleScroll(); // Handle navbar behavior on scroll
    this.getGameData(); // Fetch game data initially
  }

  // Handle category clicks in navbar
  handleNavClick() {
    if (this.navbarNav) {
      this.navbarNav.addEventListener("click", (event) => {
        const clickedLink = event.target.closest(".nav-link");
        if (clickedLink) {
          event.preventDefault();

          // Remove previous active class
          const currentActive =
            this.navbarNav.querySelector(".nav-link.active");
          if (currentActive !== clickedLink) {
            currentActive.classList.remove("active");
          }

          // Add active class to clicked category
          clickedLink.classList.add("active");

          // Get category and fetch new game data
          const category = clickedLink.dataset.category;
          this.clearInnerHTML(this.gameCardsContainer);
          this.getGameData(category);
          
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      });
    }
  }

  // Handle closing the game detail popup (via button or Escape key)
  handleCloseDetails() {
    this.closeBtn.addEventListener("click", () => this.hideDetailsBox());

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !this.bigBox.classList.contains("d-none")) {
        this.hideDetailsBox();
      }
    });
  }

  // Make navbar fixed when scrolling past a certain point
  handleScroll() {
    window.addEventListener("scroll", () => {
      if (window.scrollY >= this.offsetTopValue) {
        // Add fixed-top and remove top margin when scrolling
        this.navbar.classList.add("fixed-top", "mt-0");
        this.navbar.classList.remove("mt-5");
      } else {
        // Revert to default state
        this.navbar.classList.remove("fixed-top", "mt-0");
        this.navbar.classList.add("mt-5");
      }
    });
  }

  // Hide the big game details box
  hideDetailsBox() {
    if (!this.bigBox.classList.contains("d-none")) {
      this.bigBox.classList.add("d-none");
    }
  }

  // Fetch game data from the API by category
  async getGameData(category = "mmorpg") {
    try {
      this.loader.classList.remove("d-none"); // Show loader

      const response = await fetch(
        `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`,
        this.apiOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.gameInfo = data;

      // Display the game cards
      this.displayGames(this.gameInfo);
      this.loader.classList.add("d-none"); // Hide loader
    } catch (error) {
      console.error("Failed to fetch game data:", error);
    }
  }

  // Create a game card element and append it to the container
  createGameCard(game) {
    const newCard = document.createElement("div");
    newCard.classList.add("col-md-6", "col-lg-4", "col-xl-3");

    newCard.innerHTML = `
      <figure class="card">
        <div class="img-game p-2">
          <img src="${game.thumbnail}" alt="${
      game.title
    }" class="w-100 rounded-top-3">
        </div>
        <figcaption class="card-body p-2">
          <div class="d-flex justify-content-between align-items-center">
            <h3 class="card-title fw-semibold fs-6 text-white">${
              game.title
            }</h3>
            <span class="badge bg-primary fw-bold">Free</span>
          </div>
          <p class="text-secondary text-center mb-0">${game.short_description.substring(
            0,
            50
          )}...</p>
        </figcaption>
        <div class="card-footer p-2 d-flex justify-content-between align-items-center">
          <span class="badge bg-primary">${game.genre}</span>
          <span class="badge bg-primary">${game.platform}</span>
        </div>
      </figure>`;

    // Add click event to open game details
    const cardEvent = newCard.querySelector(".card");
    cardEvent?.addEventListener("click", () => this.showGameDetails(game));

    this.gameCardsContainer.appendChild(newCard);
  }

  // Show full game details in a modal-like section
  showGameDetails(game) {
    this.bigBox.classList.remove("d-none");
    this.loader.classList.remove("d-none");

    const detailsGameContainer = document.querySelector(".detailsGame");

    // Create left image column
    const gameImg = document.createElement("div");
    gameImg.classList.add("col-lg-4");
    gameImg.innerHTML = `
      <div class="img-game mb-4 mb-md-0">
        <img src="${game.thumbnail}" alt="${game.title}" class="w-100 rounded-3 mb-3">
      </div>
      <span class="badge bg-success detail-badge py-2 fs-6">Windows</span>
      <span class="badge bg-warning detail-badge py-2 fs-6">Free to Play</span>
      <span class="badge bg-info detail-badge py-2 fs-6">Multiplayer</span>`;

    // Create right content column
    const detailsGame = document.createElement("div");
    detailsGame.classList.add("col-lg-8");
    detailsGame.innerHTML = `
      <h1 class="mb-2 game-title">${game.title}</h1>
      <p class="mb-2"><span class="fw-bold">Category:</span> <span class="badge bg-primary">${game.genre}</span></p>
      <p class="mb-2"><span class="fw-bold">Platform:</span> <span class="badge bg-primary">Windows</span></p>
      <p class="mb-3"><span class="fw-bold">Status:</span> <span class="badge bg-primary">Live</span></p>
      <p class="line-height-base">${game.short_description}</p>
      <button class="btn btn-warning text-white fs-5 go-to">
        <i class="fas fa-play me-2"></i>Play Now
      </button>`;

    // Clear previous content and add new details
    this.clearInnerHTML(detailsGameContainer);
    detailsGameContainer.appendChild(gameImg);
    detailsGameContainer.appendChild(detailsGame);

    this.loader.classList.add("d-none");

    // Button click: open game URL in new tab
    const goToButton = document.querySelector(".go-to");
    goToButton?.addEventListener("click", () => {
      if (game.game_url) {
        window.open(game.game_url, "_blank");
      } else {
        console.warn("Game URL not available for:", game.title);
      }
    });
  }

  // Loop through games and display them
  displayGames(gamesArray) {
    if (Array.isArray(gamesArray)) {
      gamesArray.forEach((game) => this.createGameCard(game));
    } else {
      console.error("Invalid input: 'gamesArray' must be an array.");
    }
  }

  // Utility to clear HTML content from a container
  clearInnerHTML(container) {
    container.innerHTML = "";
  }
}

// Create and initialize the app
const app = new GameApp();
app.init();

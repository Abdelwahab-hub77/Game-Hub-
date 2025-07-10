
"use strict";

export class Display {
  constructor() {
    this.loader = document.querySelector(".loader-box");
    this.bigBox = document.querySelector(".big-box");
    this.gameCardsContainer = document.querySelector(".displayGame");
  }

  displayGames(gamesArray) {
    this.clearInnerHTML(this.gameCardsContainer);
    gamesArray.forEach((game) => this.createGameCard(game));
  }

  createGameCard(game) {
    const newCard = document.createElement("div");
    newCard.classList.add("col-md-6", "col-lg-4", "col-xl-3");
    newCard.innerHTML = `
      <figure class="card">
        <div class="img-game p-2">
          <img src="${game.thumbnail}" alt="${game.title}" class="w-100 rounded-top-3">
        </div>
        <figcaption class="card-body p-2">
          <div class="d-flex justify-content-between align-items-center">
            <h3 class="card-title fw-semibold fs-6 text-white">${game.title}</h3>
            <span class="badge bg-primary fw-bold">Free</span>
          </div>
          <p class="text-secondary text-center mb-0">${game.short_description.substring(0, 50)}...</p>
        </figcaption>
        <div class="card-footer p-2 d-flex justify-content-between align-items-center">
          <span class="badge bg-primary">${game.genre}</span>
          <span class="badge bg-primary">${game.platform}</span>
        </div>
      </figure>`;
    
    newCard.querySelector(".card").addEventListener("click", () => (game));
    this.gameCardsContainer.appendChild(newCard);
  }

  showGameDetails(game) {
    this.bigBox.classList.remove("d-none");
    this.loader.classList.remove("d-none");

    const detailsGameContainer = document.querySelector(".detailsGame");

    const gameImg = document.createElement("div");
    gameImg.classList.add("col-lg-4");
    gameImg.innerHTML = `
      <div class="img-game mb-4 mb-md-0">
        <img src="${game.thumbnail}" alt="${game.title}" class="w-100 rounded-3 mb-3">
      </div>
      <span class="badge bg-success detail-badge py-2 fs-6">Windows</span>
      <span class="badge bg-warning detail-badge py-2 fs-6">Free to Play</span>
      <span class="badge bg-info detail-badge py-2 fs-6">Multiplayer</span>`;

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

    this.clearInnerHTML(detailsGameContainer);
    detailsGameContainer.appendChild(gameImg);
    detailsGameContainer.appendChild(detailsGame);

    this.loader.classList.add("d-none");

    document.querySelector(".go-to").addEventListener("click", () => {
      if (game.game_url) window.open(game.game_url, "_blank");
    });
  }

  clearInnerHTML(container) {
    container.innerHTML = "";
  }

  hideDetailsBox() {
    this.bigBox.classList.add("d-none");
  }
}


 
 "use strict";

import { Display } from "./display.js";
import { Events } from "./Events.js";

// ========================================
export class GameApp 
{
  constructor() {
    // DOM Elements
    this.navbarNav = document.querySelector(".navbar-nav");
    this.navbar = document.querySelector(".navbar");
    this.scrollableDiv = document.getElementById("myScrollableDiv");
    this.closeBtn = document.querySelector("#close");

    // Utilities
    this.display = new Display();
    this.events = new Events(this.navbarNav, this.navbar, this.closeBtn, this.scrollableDiv, this.display);

    // Data
    this.apiOptions = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "9923ce835dmsh894b2cee03a15cbp14a8b8jsn771770093da3",
        "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com",
      },
    };
  }

  init() {
    this.events.registerEvents((category) => this.getGameData(category));
    this.getGameData(); // Initial load
  }

  async getGameData(category = "mmorpg") {
    try {
      this.display.loader.classList.remove("d-none");

      const response = await fetch(
        `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`,
        this.apiOptions
      );

      const data = await response.json();
      this.display.displayGames(data, (game) => this.display.showGameDetails(game));
      this.display.loader.classList.add("d-none");
    } catch (error) {
      console.error("Failed to fetch game data:", error);
    }
  }
}
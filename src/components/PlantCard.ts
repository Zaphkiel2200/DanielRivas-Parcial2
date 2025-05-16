import { Plants } from "../types/types";
import { AddActions } from "../flux/Actions";
import { store } from "../flux/Store";

class CardPlants extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  private handleAddClick = () => {
    const uuid = this.getAttribute("uuid");
    if (uuid) AddActions.toggleLike(uuid);
  };

  render() {
    const image = this.getAttribute("image") || "https://placehold.co/100x100.png";
    const name = this.getAttribute("name") || "Planta desconocida";
    const uuid = this.getAttribute("uuid");
    const state = store.getState();
    const isAdded = uuid ? state.addedPlants.includes(Number(uuid)) : false;

    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --primary-color: #3498db;
          --secondary-color: #2980b9;
          --text-color: #2c3e50;
          --border-color: #ddd;
        }
        
        .container {
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 1rem;
        }
        
        img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }
        
        h3 {
          margin: 0.5rem 0;
          color: var(--text-color);
        }
        
        button {
          padding: 0.5rem 1rem;
          background: ${isAdded ? "#e74c3c" : "var(--primary-color)"};
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
        }
      </style>
      
      <div class="container">
        <img src="${image}" alt="${name}">
        <h3>${name}</h3>
        <button id="addbtn">${isAdded ? "Quitar" : "Añadir"}</button>
      </div>
    `;

    const addButton = this.shadowRoot.querySelector("#addbtn");
    if (addButton) addButton.addEventListener("click", this.handleAddClick);
  }
}

export default CardPlants;
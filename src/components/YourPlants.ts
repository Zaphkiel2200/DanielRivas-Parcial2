import { store } from "../flux/Store";
import { StoreActions } from "../flux/Actions";

class YourPlants extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    store.subscribe(this.handleStateChange.bind(this));
    const state = store.getState();
    if (!state.plants || state.plants.length === 0) {
      await StoreActions.loadPlants();
    }
    this.render();
  }

  disconnectedCallback() {
    store.unsubscribe(this.handleStateChange.bind(this));
  }

  private handleStateChange = () => this.render();

  private handleGardenNameChange(event: Event) {
    const input = event.target as HTMLInputElement;
    StoreActions.updateGardenName(input.value);
  }

  async render() {
    if (!this.shadowRoot) return;
    const state = store.getState();
    const addedPlants = state.addedPlants || [];
    const plants = state.plants || [];
    const gardenName = state.gardenName || "Mi Jardín";

    let yourPlants = plants.filter((plant, index) => addedPlants.includes(index + 1));
    yourPlants = yourPlants.sort((a, b) => a.common_name.localeCompare(b.common_name));

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --primary-color: #3498db;
          --background-color: #f8f9fa;
          --text-color: #2c3e50;
          --border-color: #ddd;
        }
        
        .container {
          padding: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          margin-bottom: 1rem;
        }
        
        .garden-name {
          font-size: 1.5rem;
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }
        
        .plants-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        .plant-card {
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 1rem;
        }
        
        .plant-card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }
        
        .no-plants {
          text-align: center;
          padding: 2rem;
        }
        
        .add-plants-btn {
          padding: 0.5rem 1rem;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
        
        ${yourPlants.length > 0 ? `
          <div class="plants-grid">
            ${yourPlants.map(plant => `
              <div class="plant-card">
                <img src="${plant.img}" alt="${plant.common_name}">
                <h3>${plant.common_name}</h3>
                <p>${plant.scientific_name}</p>
              </div>
            `).join("")}
          </div>
        ` : `
          <div class="no-plants">
            <p>No hay plantas</p>
            <button id="add-plants-btn" class="add-plants-btn">Añade algunas plantas</button>
          </div>
        `}
      </div>
    `;

    const gardenNameInput = this.shadowRoot.querySelector(".garden-name");
    if (gardenNameInput) {
      gardenNameInput.addEventListener("click", () => {
        const input = document.createElement("input");
        input.value = gardenName;
        input.className = "garden-name-input";
        gardenNameInput.replaceWith(input);
        input.focus();
        
        input.addEventListener("blur", () => {
          StoreActions.updateGardenName(input.value);
          input.replaceWith(gardenNameInput);
          gardenNameInput.textContent = input.value || "";
        });
        
        input.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            StoreActions.updateGardenName(input.value);
            input.replaceWith(gardenNameInput);
            gardenNameInput.textContent = input.value || "";
          }
        });
      });
    }

    const addPlantsBtn = this.shadowRoot.querySelector("#add-plants-btn");
    if (addPlantsBtn) {
      addPlantsBtn.addEventListener("click", () => StoreActions.navigate("modifyGarden"));
    }
  }
}

export default YourPlants;
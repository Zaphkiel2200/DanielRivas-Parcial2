import { store } from "../flux/Store";
import { AddActions, StoreActions } from "../flux/Actions";

class ModifyGarden extends HTMLElement {
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

  private handleTogglePlant(plantId: string) {
    AddActions.toggleLike(plantId);
  }

  async render() {
    if (!this.shadowRoot) return;
    const state = store.getState();
    const addedPlants = state.addedPlants || [];
    const plants = state.plants || [];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --primary-color: #3498db;
          --secondary-color: #2980b9;
          --background-color: #f8f9fa;
          --text-color: #2c3e50;
          --border-color: #ddd;
        }
        
        .modify-container {
          padding: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .back-button {
          padding: 0.5rem 1rem;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 1rem;
        }
        
        .header {
          text-align: center;
          margin-bottom: 1rem;
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
        
        .plant-button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 0.5rem;
          width: 100%;
        }
        
        .plant-button.add {
          background: var(--primary-color);
          color: white;
        }
        
        .plant-button.remove {
          background: #e74c3c;
          color: white;
        }
      </style>
      
      <div class="modify-container">
        <button class="back-button" id="backBtn">← Regresar</button>
        <div class="header">
          <h2>Modificar las Plantas</h2>
        </div>
        <div class="plants-grid">
          ${plants.map((plant, index) => {
            const plantId = index + 1;
            const isAdded = addedPlants.includes(plantId);
            return `
              <div class="plant-card">
                <img src="${plant.img}" alt="${plant.common_name}">
                <h3>${plant.common_name}</h3>
                <p>${plant.scientific_name}</p>
                <button class="plant-button ${isAdded ? "remove" : "add"}" 
                        data-id="${plantId}">
                  ${isAdded ? "Quitar" : "Añadir"}
                </button>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    this.shadowRoot.querySelectorAll("button[data-id]").forEach((button) => {
      button.addEventListener("click", (e) => {
        const plantId = (e.target as HTMLElement).getAttribute("data-id");
        if (plantId) this.handleTogglePlant(plantId);
      });
    });

    const backBtn = this.shadowRoot.querySelector("#backBtn");
    if (backBtn) backBtn.addEventListener("click", () => StoreActions.navigate("home"));
  }
}

export default ModifyGarden;
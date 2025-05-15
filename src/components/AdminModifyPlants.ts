import { Plants } from "../types/types";
import { updatePlant } from "../services/Plants";
import { store } from "../flux/Store";
import { StoreActions, StoreActionTypes } from "../flux/Actions";
import { AppDispatcher } from "../flux/Dispatcher";

class AdminModifyPlants extends HTMLElement {
  private selectedPlant: Plants | null = null;
  private selectedIndex: number = -1;

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

  private handlePlantSelect(plant: Plants, index: number) {
    this.selectedPlant = plant;
    this.selectedIndex = index;
    this.render();
  }

  private async handleFormSubmit(event: Event) {
    event.preventDefault();
    if (!this.shadowRoot || !this.selectedPlant) return;

    const form = this.shadowRoot.querySelector("form") as HTMLFormElement;
    const formData = new FormData(form);

    const updatedPlant: Plants = {
      ...this.selectedPlant,
      common_name: formData.get("common_name") as string,
      scientific_name: formData.get("scientific_name") as string,
      img: formData.get("img") as string,
      type: formData.get("type") as string,
      origin: formData.get("origin") as string,
      flowering_season: formData.get("flowering_season") as string,
      sun_exposure: formData.get("sun_exposure") as string,
      watering: formData.get("watering") as string,
    };

    try {
      await updatePlant(updatedPlant);
      const state = store.getState();
      const updatedPlants = [...state.plants];
      if (this.selectedIndex >= 0) {
        updatedPlants[this.selectedIndex] = updatedPlant;
      }
      AppDispatcher.dispatch({
        type: StoreActionTypes.LOAD_PLANTS,
        payload: updatedPlants,
      });
      this.selectedPlant = null;
      this.selectedIndex = -1;
      await StoreActions.loadPlants();
    } catch (error) {
      console.error("Error al actualizar la planta:", error);
    }
  }

  private handleCancel() {
    this.selectedPlant = null;
    this.selectedIndex = -1;
    this.render();
  }

  async render() {
    if (!this.shadowRoot) return;
    const state = store.getState();
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
        
        .admin-container {
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
        
        .admin-title {
          color: var(--text-color);
          margin-bottom: 1rem;
        }
        
        .plants-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        .plant-card {
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 1rem;
          cursor: pointer;
        }
        
        .plant-card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }
        
        .plant-form {
          margin-top: 1rem;
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
        }
        
        input, select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
        }
        
        .form-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .save-btn {
          background: var(--primary-color);
          color: white;
        }
        
        .cancel-btn {
          background: #e74c3c;
          color: white;
        }
      </style>
      
      <div class="admin-container">
        <button class="back-button" id="backBtn">← Volver</button>
        <h2 class="admin-title">Modificar Plantas</h2>
        
        ${this.selectedPlant ? `
          <div class="plant-form">
            <h3>Editar: ${this.selectedPlant.common_name}</h3>
            <form id="editForm">
              <div class="form-group">
                <label>Nombre común:</label>
                <input type="text" name="common_name" value="${this.selectedPlant.common_name}" required>
              </div>
              <div class="form-group">
                <label>Nombre científico:</label>
                <input type="text" name="scientific_name" value="${this.selectedPlant.scientific_name}" required>
              </div>
              <div class="form-group">
                <label>URL de imagen:</label>
                <input type="url" name="img" value="${this.selectedPlant.img}" required>
              </div>
              <div class="form-group">
                <label>Tipo:</label>
                <input type="text" name="type" value="${this.selectedPlant.type}" required>
              </div>
              <div class="form-group">
                <label>Origen:</label>
                <input type="text" name="origin" value="${this.selectedPlant.origin}" required>
              </div>
              <div class="form-group">
                <label>Temporada de floración:</label>
                <input type="text" name="flowering_season" value="${this.selectedPlant.flowering_season}" required>
              </div>
              <div class="form-group">
                <label>Exposición al sol:</label>
                <input type="text" name="sun_exposure" value="${this.selectedPlant.sun_exposure}" required>
              </div>
              <div class="form-group">
                <label>Riego:</label>
                <input type="text" name="watering" value="${this.selectedPlant.watering}" required>
              </div>
              <div class="form-buttons">
                <button type="submit" class="save-btn">Guardar</button>
                <button type="button" class="cancel-btn" id="cancelBtn">Cancelar</button>
              </div>
            </form>
          </div>
        ` : `
          <div class="plants-list">
            ${plants.map((plant, index) => `
              <div class="plant-card" data-id="${index}">
                <img src="${plant.img}" alt="${plant.common_name}">
                <h3>${plant.common_name}</h3>
                <p>${plant.scientific_name}</p>
              </div>
            `).join("")}
          </div>
        `}
      </div>
    `;

    if (this.selectedPlant) {
      const form = this.shadowRoot.querySelector("#editForm");
      if (form) form.addEventListener("submit", this.handleFormSubmit.bind(this));
      const cancelBtn = this.shadowRoot.querySelector("#cancelBtn");
      if (cancelBtn) cancelBtn.addEventListener("click", this.handleCancel.bind(this));
    } else {
      const plantCards = this.shadowRoot.querySelectorAll(".plant-card");
      plantCards.forEach((card) => {
        card.addEventListener("click", () => {
          const plantIndex = Number(card.getAttribute("data-id"));
          const plant = plants[plantIndex];
          if (plant) this.handlePlantSelect(plant, plantIndex);
        });
      });
    }

    const backBtn = this.shadowRoot.querySelector("#backBtn");
    if (backBtn) backBtn.addEventListener("click", () => StoreActions.navigate("home"));
  }
}

export default AdminModifyPlants;
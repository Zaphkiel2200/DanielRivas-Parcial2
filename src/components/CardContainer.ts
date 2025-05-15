import { store } from "../flux/Store";
import { StoreActions } from "../flux/Actions";

class CardContainer extends HTMLElement {
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

  render() {
    if (!this.shadowRoot) return;
    const state = store.getState();
    const plants = state.plants || [];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --primary-color: #3498db;
          --background-color: #f8f9fa;
          --text-color: #2c3e50;
        }
        
        .container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
          padding: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          margin-bottom: 1rem;
          padding: 1rem;
        }
        
        .header h1 {
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }
        
        .header p {
          color: var(--text-color);
        }
      </style>
      
      <div class="container">
        ${plants.map((plant, index) => `
          <card-plants
            uuid="${index + 1}"
            image="${plant.img}"
            name="${plant.common_name}">
          </card-plants>
        `).join("")}
      </div>
    `;
  }
}

export default CardContainer;
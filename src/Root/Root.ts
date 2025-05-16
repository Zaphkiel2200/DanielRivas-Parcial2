import { store } from "../flux/Store";
import { StoreActions } from "../flux/Actions";

class Root extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    store.load();
    store.subscribe(this.handleStateChange.bind(this));
    this.addEventListener(
      "navigate",
      this.handleNavigation.bind(this) as EventListener
    );

    await StoreActions.loadPlants();
    this.render();
  }

  private handleStateChange = () => {
    this.render();
  };

  private handleNavigation(event: CustomEvent) {
    if (event.detail && event.detail.page) {
      StoreActions.navigate(event.detail.page);
    }
  }

  render() {
    if (!this.shadowRoot) return;

    const state = store.getState();
    const gardenName = state.gardenName || "Mi Jardín";
    const currentPage = state.currentPage || "home";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          --primary-color: #3498db;
          --secondary-color: #2980b9;
          --text-color: #2c3e50;
          --light-color: #f8f9fa;
          --border-color: #ddd;
        }
        
        header {
          background: var(--primary-color);
          color: white;
          padding: 1rem;
          text-align: center;
        }
        
        h1 {
          margin: 0;
          font-size: 1.5rem;
        }
        
        nav {
          display: flex;
          justify-content: center;
          background: white;
          padding: 0.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        nav button {
          padding: 0.5rem 1rem;
          margin: 0 0.25rem;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-color);
          border-bottom: 2px solid transparent;
        }
        
        nav button.active {
          color: var(--primary-color);
          border-bottom: 2px solid var(--primary-color);
        }
        
        main {
          padding: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        @media (max-width: 768px) {
          nav {
            flex-wrap: wrap;
          }
          
          nav button {
            padding: 0.5rem;
            font-size: 0.9rem;
          }
        }
      </style>
      
      <header>
        <h1>${gardenName}</h1>
      </header>
      
      <nav>
        <button id="homeBtn" class="${currentPage === "home" ? "active" : ""}">
          Principal
        </button>
        <button id="modifyGardenBtn" class="${currentPage === "modifyGarden" ? "active" : ""}">
          Modificar el Jardín
        </button>
        <button id="adminBtn" class="${currentPage === "admin" ? "active" : ""}">
          Admin
        </button>
      </nav>
      
      <main>
        ${this.renderPage(currentPage)}
      </main>
    `;

    this.setupNavigation();
  }

  private setupNavigation() {
    const homeBtn = this.shadowRoot?.querySelector("#homeBtn");
    const modifyGardenBtn = this.shadowRoot?.querySelector("#modifyGardenBtn");
    const adminBtn = this.shadowRoot?.querySelector("#adminBtn");

    homeBtn?.addEventListener("click", () => StoreActions.navigate("home"));
    modifyGardenBtn?.addEventListener("click", () => StoreActions.navigate("modifyGarden"));
    adminBtn?.addEventListener("click", () => StoreActions.navigate("admin"));
  }

  private renderPage(currentPage: string) {
    switch (currentPage) {
      case "home":
        return "<your-plants></your-plants>";
      case "modifyGarden":
        return "<modify-garden></modify-garden>";
      case "admin":
        return "<admin-modify-plants></admin-modify-plants>";
      default:
        return "<p>Página no encontrada</p>";
    }
  }
}

export default Root;
import { store } from '../flux/Store';
import { getPlants } from '../services/Plants';
import '../components/PlantCard';

export class Root extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const plants = await getPlants();
        this.renderPlants(plants);
    }

    renderPlants(plants: any[]) {
        if (!this.shadowRoot) return;
        
        this.shadowRoot.innerHTML = `
            <style>
                .plants-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 1rem;
                    padding: 1rem;
                }
            </style>
            <div class="plants-container">
                ${plants.map(plant => `
                    <plant-card
                        common-name="${plant.commonName}"
                        scientific-name="${plant.scientificName}"
                        img="${plant.img}"
                    ></plant-card>
                `).join('')}
            </div>
        `;
    }
}

customElements.define('root-element', Root);
import { getPlants } from '../services/Plants';
import '../components/PlantCard';

export class Root extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const plants = await getPlants();
        this.shadowRoot!.innerHTML = `
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
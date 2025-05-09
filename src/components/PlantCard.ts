export class PlantCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const commonName = this.getAttribute('common-name') || '';
        const scientificName = this.getAttribute('scientific-name') || '';
        const img = this.getAttribute('img') || '';

        this.shadowRoot!.innerHTML = `
            <style>
                .card {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 10px;
                    margin: 10px;
                    width: 200px;
                }
                .card img {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                }
                h3 { 
                margin: 5px 0; color: green; 
                }
                p { 
                margin: 0; font-style: italic; color: #666; 
                }
            </style>
            <div class="card">
                <img src="${img}" alt="${commonName}">
                <h3>${commonName}</h3>
                <p>${scientificName}</p>
            </div>
        `;
    }
}

customElements.define('plant-card', PlantCard);
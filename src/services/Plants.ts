export interface Plant {
    id: number;
    commonName: string;
    scientificName: string;
    img: string;
    type: string;
    origin: string;
    floweringSeason: string;
    sunExposure: string;
    watering: string;
}

export async function getPlants(): Promise<Plant[]> {
    try {
        const response = await fetch('/plants.json');
        return await response.json();
    } catch (error) {
        console.error('Error loading plants:', error);
        return [];
    }
}

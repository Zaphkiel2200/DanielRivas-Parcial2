// src/services/Plants.ts
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
        const response = await fetch('http://192.168.131.101:8080/dca/api/plants');
        if (!response.ok) throw new Error('Error al cargar plantas');
        return await response.json();
    } catch (error) {
        console.error('Error fetching plants:', error);
        return [];
    }
}

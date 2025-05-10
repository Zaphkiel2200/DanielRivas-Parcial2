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
    const response = await fetch('http://192.168.131.101:8080/dca/api/plants');
    return await response.json();
}

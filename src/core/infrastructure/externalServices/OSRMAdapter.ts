import axios from "axios";

const OSRM_BASE_URL = "http://router.project-osrm.org";

export class OSRMAdapter {
    static async getRutaOSRM(coordinates: { latitud: number; longitud: number }[]) {
        const coordString = coordinates.map(c => `${c.longitud},${c.latitud}`).join(";");
        const url = `${OSRM_BASE_URL}/route/v1/driving/${coordString}?overview=full&steps=false&annotations=true`;

        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching route from OSRM:", error);
            return null;
        }
    }
}

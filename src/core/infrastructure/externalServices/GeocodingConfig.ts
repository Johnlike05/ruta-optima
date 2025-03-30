import { Coordenadas } from "@/core/domain/entities/Coordenadas";

const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});

export async function googleMapsClient(address:string): Promise<Coordenadas | undefined>  {
  try {
    const response = await client.geocode({
      params: {
        address: address + ', Colombia',
        key: process.env.GOOGLE_MAPS_KEY,
      },
      timeout: 1000
    });

    if (response.data.results.length === 0) {
      throw new Error('Dirección no encontrada');
    }

    const { lat, lng } = response.data.results[0].geometry.location;
    return { latitud: lat, longitud: lng };
  } catch (error) {
    console.error('Error usando Google Maps Free:', JSON.stringify(error));
    // Fallback a OpenStreetMap si falla
    // return fallbackOpenStreetMap(address);
  }
}
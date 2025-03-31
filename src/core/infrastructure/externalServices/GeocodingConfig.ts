import { Coordenadas } from "@/core/domain/entities/Coordenadas";

const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});

export async function googleMapsClient(address:string): Promise<Coordenadas | undefined>  {
  
  try {
    const response = await client.geocode({
      params: {
        address: address + ', Colombia',
        key: 'AIzaSyBiBl73BPLME98ABMShRqVUNP8BYKAsnsg',
      },
      timeout: 1000
    });
    const { lat, lng } = response.data.results[0].geometry.location;
    return { latitud: lat, longitud: lng };
  } catch (error) {
    console.error('Error usando Google Maps Free:', JSON.stringify(error));
    return undefined
  }
}
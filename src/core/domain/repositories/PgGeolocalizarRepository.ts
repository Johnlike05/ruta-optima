import { Coordenadas } from "../entities/Coordenadas";

export interface IGeolocalizarRepository {
  getCoordinates(address: string): Promise<Coordenadas | null>;
  batchGeocode(addresses: string[]): Promise<Coordenadas[]>;
}

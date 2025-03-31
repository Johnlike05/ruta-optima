import { Coordenadas } from "../entities/Coordenadas";

export interface IGeolocalizarRepository {
  batchGeocode(addresses: string[]): Promise<Coordenadas[]>;
}

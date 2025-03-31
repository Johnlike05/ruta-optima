import { DEPENDENCY_CONTAINER } from "@/configuration/DependecyContainer";
import { TYPESDEPENDENCIES } from "@/configuration/TypesDependencies";
import { PgGeolocalizarRepository } from "@/core/infrastructure/bd/repositories/PgGeolocalizarRepository";

export class GeolocalizarService {
    private geolocalizarRepository = DEPENDENCY_CONTAINER.get<PgGeolocalizarRepository>(TYPESDEPENDENCIES.IGeolocalizarRepository)
    async getCoordinatesArray(address: string[]) {
      return this.geolocalizarRepository.batchGeocode(address);
    }
}
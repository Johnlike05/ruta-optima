import { Coordenadas } from "@/core/domain/entities/Coordenadas";
// import { RedisClient } from '../../adapter/Config'; // Asume que tienes un cliente Redis configurado
import { IGeolocalizarRepository } from "../../../domain/repositories/PgGeolocalizarRepository";
import { googleMapsClient } from "../../externalServices/GeocodingConfig";
import { TYPESDEPENDENCIES } from "@/configuration/TypesDependencies";
import { DEPENDENCY_CONTAINER } from "@/configuration/DependecyContainer";
import { CacheRepository } from "@/core/domain/repositories/CacheRepository";

export class PgGeolocalizarRepository implements IGeolocalizarRepository {
  private redis = DEPENDENCY_CONTAINER.get<CacheRepository>(
    TYPESDEPENDENCIES.CacheGenericDao
  );
  async getCoordinates(address: string): Promise<Coordenadas | null> {
    const keyRedis = "geo" + address;
    const responseRedis = await this.redis.get<string>(keyRedis);
    if (responseRedis) {
      return JSON.parse(responseRedis);
    }
    const coordenadasGoogle = await googleMapsClient(address);
    if (coordenadasGoogle) {
      this.redis.set(keyRedis, JSON.stringify(coordenadasGoogle));
      return coordenadasGoogle;
    }
    return null
  }
  async batchGeocode(addresses: string[]): Promise<Coordenadas[]> {
    const keys = addresses.map(addr => "geo:" + addr);
    const cachedResults = await Promise.all(keys.map(key => this.redis.get<string>(key)));
    const missingIndexes: number[] = [];
    const missingAddresses: string[] = [];
    const coordenadasCacheadas: (Coordenadas | null)[] = cachedResults.map((result, index) => {
      if (result) return JSON.parse(result);
      missingIndexes.push(index);
      missingAddresses.push(addresses[index]);
      return null;
    });

    if (missingAddresses.length > 0) {
      const newCoordinates = await Promise.all(missingAddresses.map(addr => googleMapsClient(addr)));

      await Promise.all(newCoordinates.map((coords, i) => {
        if (coords) {
          const key = keys[missingIndexes[i]];
          this.redis.set(key, JSON.stringify(coords));
          coordenadasCacheadas[missingIndexes[i]] = coords;
        }
      }));
    }

    return coordenadasCacheadas.filter(coord => coord !== null) as Coordenadas[];
  }
}

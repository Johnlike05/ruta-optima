import { DEPENDENCY_CONTAINER } from "@/configuration/DependecyContainer";
import { IDatabase, IMain } from "pg-promise";
import { TYPESDEPENDENCIES } from "@/configuration/TypesDependencies";
import { IEventoIn } from "@/core/application/data/in/IEventoIn";
import { IEventoRepository } from "@/core/domain/repositories/IEventoRepository";

export class PgEventoRepository implements IEventoRepository {
  private dbRutas = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(
    TYPESDEPENDENCIES.bdRutas
  );
    async agregarEvento(data: IEventoIn, id_ruta: number): Promise<void> {
        try {
            const query = `
            INSERT INTO john_schema.evento (tipo, descripcion, latitud, longitud, tiempo_estimado, id_ruta, id_repartidor, agregado ) 
                VALUES ($/tipo/, $/descripcion/, $/latitud/, $/longitud/, $/tiempo_estimado/, $/id_ruta/, $/id_repartidor/, false);
            `;
            await this.dbRutas.oneOrNone(query, {
            tipo: data.tipo,
            descripcion: data.descripcion,
            latitud: data.latitud,
            longitud: data.longitud,
            tiempo_estimado: data.tiempo_estimado,
            id_ruta: id_ruta,
            id_repartidor: data.id_repartidor
        });
        } catch (error) {
            console.log('ERROR', JSON.stringify(error));
            throw error
        }

    }
}

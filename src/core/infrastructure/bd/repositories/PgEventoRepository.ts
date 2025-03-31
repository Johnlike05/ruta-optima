import { DEPENDENCY_CONTAINER } from "@/configuration/DependecyContainer";
import { IDatabase, IMain } from "pg-promise";
import { TYPESDEPENDENCIES } from "@/configuration/TypesDependencies";
import { IEventoIn } from "@/core/application/data/in/IEventoIn";
import { IEventoRepository } from "@/core/domain/repositories/IEventoRepository";
import { Evento } from "@/core/domain/entities/Evento";

export class PgEventoRepository implements IEventoRepository {
  private dbRutas = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(
    TYPESDEPENDENCIES.bdRutas
  );
        async agregarEvento(data: IEventoIn, id_ruta: number): Promise<void> {
            try {
            const query = `
                    INSERT INTO john_schema.evento (tipo, descripcion, latitud, longitud, tiempo_estimado, id_ruta, id_repartidor, pendiente ) 
                        VALUES ($/tipo/, $/descripcion/, $/latitud/, $/longitud/, $/tiempo_estimado/, $/id_ruta/, $/id_repartidor/, true);
                    `;
            await this.dbRutas.oneOrNone(query, {
                tipo: data.tipo,
                descripcion: data.descripcion,
                latitud: data.latitud,
                longitud: data.longitud,
                tiempo_estimado: data.tiempo_estimado,
                id_ruta: id_ruta,
                id_repartidor: data.id_repartidor,
            });
            } catch (error) {
            console.log("ERROR", JSON.stringify(error));
            throw error;
            }
        }
        async consultarEventoByRuta(id_ruta: number): Promise<Evento[]> {
            try {
            const query = `
                        SELECT * from john_schema.evento where id_ruta = $/id_ruta/ and pendiente = true
                    `;
            return await this.dbRutas.query(query, {
                id_ruta: id_ruta,
            });
            } catch (error) {
            console.log("ERROR", JSON.stringify(error));
            throw error;
            }
        }
        async marcarEventosCompletados(id_eventos: number[]): Promise<void> {
            try {
            const query = `
                        UPDATE john_schema.evento SET pendiente = false where id_evento IN ($/id_eventos:csv/)
                    `;
            await this.dbRutas.query(query, {id_eventos:id_eventos});
            } catch (error) {
            console.log("ERROR", JSON.stringify(error));
            throw error;
            }
        }
}

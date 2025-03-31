import { IRutaRepository } from "../../../domain/repositories/IRutaRepository";
import { Ruta, PuntoRuta } from "../../../domain/entities/Ruta";
import { DEPENDENCY_CONTAINER } from "@/configuration/DependecyContainer";
import { IDatabase, IMain } from "pg-promise";
import { TYPESDEPENDENCIES } from "@/configuration/TypesDependencies";

export class PgRutaRepository implements IRutaRepository {
  // Gestión de rutas
  private dbRutas = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(
    TYPESDEPENDENCIES.bdRutas
  );
  async crearRuta(
    repartidorId: number,
    puntos: PuntoRuta[],
    distancia_total: number,
    tiempo_estimado: number
  ): Promise<Ruta> {
    try {
      await this.dbRutas.query("BEGIN");
      const rutaQuery = `
                INSERT INTO john_schema.ruta (
                    id_repartidor,
                    distancia_total,
                    tiempo_estimado,
                    estado
                ) VALUES ($1, $2, $3, 'planificada')
                RETURNING id_ruta
            `;

      const rutaResult = await this.dbRutas.oneOrNone(rutaQuery, [
        repartidorId,
        distancia_total,
        tiempo_estimado,
      ]);

      const rutaId = rutaResult.id_ruta;
      console.log("resssss", rutaId);

      // 3. Insertar puntos de ruta
      for (const [index, punto] of puntos.entries()) {
        await this.dbRutas.query(
          `
                    INSERT INTO john_schema.punto_ruta (
                        id_ruta,
                        orden,
                        latitud,
                        longitud,
                        tiempo_estimado,
                        direccion
                    ) VALUES ($1, $2, $3, $4, $5, $6)
                `,
          [
            rutaId,
            index + 1,
            punto.latitud,
            punto.longitud,
            punto.tiempoEstimado,
            punto.direccion,
          ]
        );
      }

      await this.dbRutas.query("COMMIT");

      // 4. Retornar ruta completa
      return this.obtenerRutaPorId(rutaId);
    } catch (error) {
      await this.dbRutas.query("ROLLBACK");
      throw error;
    }
  }

  async obtenerRutaPorId(ruta_id: number): Promise<Ruta> {
    const query = `
            SELECT r.*,
                   json_agg(
                       json_build_object(
                           'orden', pr.orden,
                           'latitud', pr.latitud,
                           'longitud', pr.longitud,
                           'tiempoEstimado', pr.tiempo_estimado
                       ) ORDER BY pr.orden
                   ) as puntos
            FROM john_schema.ruta r
            JOIN john_schema.punto_ruta pr ON r.id_ruta = pr.id_ruta
            WHERE r.id_ruta = $/ruta_id/
            GROUP BY r.id_ruta
        `;

    const result = await this.dbRutas.oneOrNone(query, { ruta_id: ruta_id });
    return result;
  }
  async consultarRutaDiaria(id_repartidor: number): Promise<number | null> {
    try {
      const query = `
        SELECT id_ruta
         FROM john_schema.ruta
         WHERE id_repartidor = $/id_repartidor/
         AND fecha_creacion >= NOW() - INTERVAL '24 HOURS';
     `;

      const result = await this.dbRutas.oneOrNone(query, {
        id_repartidor: id_repartidor,
      });
      if (result) {
        return result.id_ruta;
      }
      return null;
    } catch (error) {
      console.log("Error en consultarRutaDiaria", error);
      return null;
    }
  }
  async agregarTiempoRuta(tiempo: number, id_ruta: number): Promise<void> {
    try {
      const query = `
       UPDATE john_schema.ruta 
        SET tiempo_estimado = tiempo_estimado + $/tiempo/
        WHERE id_ruta = $/id_ruta/;
     `;
      const result = await this.dbRutas.oneOrNone(query, {
        tiempo: tiempo,
        id_ruta: id_ruta,
      });
      if (result) {
        return result.id_ruta;
      }
    } catch (error) {
      console.log("Error en consultarRutaDiaria", error);
    }
  }
}

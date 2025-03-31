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
                ) VALUES ($/repartidorId/, $/distancia_total/, $/tiempo_estimado/, 'planificada')
                RETURNING id_ruta
            `;

      const rutaResult = await this.dbRutas.oneOrNone(rutaQuery, {
        repartidorId: repartidorId,
        distancia_total: distancia_total,
        tiempo_estimado: tiempo_estimado,
      });
      const rutaId = rutaResult.id_ruta;
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
                    ) VALUES ($/rutaId/, $/index/, $/latitud/, $/longitud/, $/tiempoEstimado/, $/direccion/)
                `,
          {
            rutaId: rutaId,
            index: index + 1,
            latitud: punto.latitud,
            longitud: punto.longitud,
            tiempoEstimado: punto.tiempoEstimado,
            direccion: punto.direccion,
          }
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
    const queryRuta = `
      SELECT 
        r.id_ruta, 
        r.id_repartidor, 
        r.fecha_creacion, 
        r.distancia_total, 
        r.tiempo_estimado, 
        r.estado, 
        r.optimizada
      FROM john_schema.ruta r
      WHERE r.id_ruta = $/ruta_id/;
    `;

    const ruta = await this.dbRutas.oneOrNone(queryRuta, {ruta_id: ruta_id});

    if (!ruta) {
      throw new Error("Ruta no encontrada");
    }
    const queryPuntos = `
      SELECT 
        pr.orden, 
        pr.latitud, 
        pr.longitud, 
        pr.tiempo_estimado
      FROM john_schema.punto_ruta pr
      WHERE pr.id_ruta = $/ruta_id/
      ORDER BY pr.orden;
    `;

    const puntos = await this.dbRutas.any(queryPuntos, { ruta_id: ruta_id });

    const puntosFormateados = puntos.map((punto) => ({
      orden: punto.orden,
      latitud: punto.latitud,
      longitud: punto.longitud,
      tiempoEstimado: punto.tiempo_estimado,
    }));

    // Devolvemos la ruta junto con los puntos agrupados
    return {
      ...ruta,
      puntos: puntosFormateados,
    };
  }

  async consultarRutaDiaria(id_repartidor: number): Promise<number | null> {
    try {
      const ahora = new Date().toISOString().slice(0, 19).replace("T", " ");
      const query = `
        SELECT id_ruta
         FROM john_schema.ruta
         WHERE id_repartidor = $/id_repartidor/
         AND fecha_creacion >= (CAST($/ahora/ AS TIMESTAMP) - INTERVAL '24 HOURS');
     `;
      const result = await this.dbRutas.oneOrNone(query, {
        id_repartidor: id_repartidor,
        ahora: ahora,
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
      console.log("Error en agregarTiempoRuta", error);
    }
  }
}



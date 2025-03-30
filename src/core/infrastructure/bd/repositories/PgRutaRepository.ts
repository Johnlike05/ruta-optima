import { IRutaRepository } from "../../../domain/repositories/IRutaRepository";
import { Ruta, PuntoRuta } from "../../../domain/entities/Ruta";
import { DEPENDENCY_CONTAINER } from "@/configuration/DependecyContainer";
import { IDatabase, IMain } from "pg-promise";
import { TYPESDEPENDENCIES } from "@/configuration/TypesDependencies";

export class PgRutaRepository implements IRutaRepository {
    // Gestión de rutas
    private dbRutas = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(
        TYPESDEPENDENCIES.bdRutas,
    );
    async crearRuta(repartidorId: number, puntos: PuntoRuta[], distancia_total: number, tiempo_estimado: number): Promise<Ruta> {
        try {
            await this.dbRutas.query('BEGIN');

            //consultar si repartidor ya tiene una ruta hoy
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
                tiempo_estimado
            ]);
            
            const rutaId = rutaResult.id_ruta;  
            console.log('resssss', rutaId);

            // 3. Insertar puntos de ruta
            for (const [index, punto] of puntos.entries()) {
                await this.dbRutas.query(`
                    INSERT INTO john_schema.punto_ruta (
                        id_ruta,
                        orden,
                        latitud,
                        longitud,
                        tiempo_estimado,
                        direccion
                    ) VALUES ($1, $2, $3, $4, $5, $6)
                `, [
                    rutaId,
                    index + 1,
                    punto.latitud,
                    punto.longitud,
                    punto.tiempoEstimado,
                    punto.direccion
                ]);
            }

            await this.dbRutas.query('COMMIT');
            
            // 4. Retornar ruta completa
            return this.obtenerRutaPorId(rutaId);
        } catch (error) {
            await this.dbRutas.query('ROLLBACK');
            throw error;
        }
    }

    async obtenerRutaActiva(repartidorId: number): Promise<Ruta | null> {
        const query = `
            SELECT r.*, 
                   json_agg(
                       json_build_object(
                           'orden', pr.orden,
                           'latitud', pr.latitud,
                           'longitud', pr.longitud,
                           'tiempoEstimado', pr.tiempo_estimado,
                           'completado', pr.completado
                       ) ORDER BY pr.orden
                   ) as puntos
            FROM john_schema.ruta r
            JOIN john_schema.punto_ruta pr ON r.id_ruta = pr.id_ruta
            WHERE r.id_repartidor = $1
            AND r.estado = 'en_progreso'
            GROUP BY r.id_ruta
            LIMIT 1
        `;
        
        const result = await this.dbRutas.query(query, [repartidorId]);
        return result.rows[0] ? this.toDomain(result.rows[0]) : null;
    }

    // Optimización
    async recalcularRuta(rutaId: number): Promise<Ruta> {
        try {
            await this.dbRutas.query('BEGIN');
            
            // 1. Obtener puntos actuales
            const puntosQuery = `
                SELECT latitud, longitud 
                FROM john_schema.punto_ruta 
                WHERE id_ruta = $1 
                ORDER BY orden
            `;
            const puntosResult = await this.dbRutas.query(puntosQuery, [rutaId]);
            
            // 2. Recalcular métricas (simplificado)
            const { distanciaTotal, tiempoEstimado } = this.calcularMetricasRuta(puntosResult.rows);

            // 3. Actualizar ruta
            await this.dbRutas.query(`
                UPDATE john_schema.ruta
                SET distancia_total = $1,
                    tiempo_estimado = $2,
                    optimizada = TRUE,
                    fecha_actualizacion = NOW()
                WHERE id_ruta = $3
            `, [distanciaTotal, tiempoEstimado, rutaId]);

            await this.dbRutas.query('COMMIT');
            
            return this.obtenerRutaPorId(rutaId);
        } catch (error) {
            await this.dbRutas.query('ROLLBACK');
            throw error;
        }
    }

    async agregarPunto(rutaId: number, punto: PuntoRuta): Promise<void> {
        try {
            await this.dbRutas.query('BEGIN');
            
            // 1. Obtener el máximo orden actual
            const maxOrderResult = await this.dbRutas.query(`
                SELECT MAX(orden) as max_orden 
                FROM john_schema.punto_ruta 
                WHERE id_ruta = $1
            `, [rutaId]);
            
            const nuevoOrden = (maxOrderResult.rows[0].max_orden || 0) + 1;

            // 2. Insertar nuevo punto
            await this.dbRutas.query(`
                INSERT INTO john_schema.punto_ruta (
                    id_ruta,
                    orden,
                    latitud,
                    longitud,
                    tiempo_estimado,
                    tipo,
                    referencia_id
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [
                rutaId,
                nuevoOrden,
                punto.latitud,
                punto.longitud,
                punto.tiempoEstimado,
                punto.referenciaId
            ]);

            // 3. Recalcular ruta
            await this.recalcularRuta(rutaId);

            await this.dbRutas.query('COMMIT');
        } catch (error) {
            await this.dbRutas.query('ROLLBACK');
            throw error;
        }
    }

    // Consultas
    async obtenerHistorial(repartidorId: number): Promise<Ruta[]> {
        const query = `
            SELECT r.*, 
                   json_agg(
                       json_build_object(
                           'orden', pr.orden,
                           'latitud', pr.latitud,
                           'longitud', pr.longitud,
                           'tiempoEstimado', pr.tiempo_estimado,
                           'tipo', pr.tipo,
                           'referenciaId', pr.referencia_id,
                           'completado', pr.completado
                       ) ORDER BY pr.orden
                   ) as puntos
            FROM john_schema.ruta r
            JOIN john_schema.punto_ruta pr ON r.id_ruta = pr.id_ruta
            WHERE r.id_repartidor = $1
            AND r.estado = 'completada'
            GROUP BY r.id_ruta
            ORDER BY r.fecha_creacion DESC
            LIMIT 10
        `;
        
        const result = await this.dbRutas.query(query, [repartidorId]);
        return result.rows.map(this.toDomain);
    }

    async obtenerRutasConRetraso(): Promise<Ruta[]> {
        const query = `
            SELECT r.*, 
                   json_agg(
                       json_build_object(
                           'orden', pr.orden,
                           'latitud', pr.latitud,
                           'longitud', pr.longitud,
                           'tiempoEstimado', pr.tiempo_estimado,
                           'tipo', pr.tipo,
                           'referenciaId', pr.referencia_id,
                           'completado', pr.completado
                       ) ORDER BY pr.orden
                   ) as puntos
            FROM john_schema.ruta r
            JOIN john_schema.punto_ruta pr ON r.id_ruta = pr.id_ruta
            WHERE r.estado = 'en_progreso'
            AND r.fecha_estimada_fin < NOW()
            GROUP BY r.id_ruta
        `;
        
        const result = await this.dbRutas.query(query);
        return result.rows.map(this.toDomain);
    }

    // Helpers
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
        
        const result = await this.dbRutas.oneOrNone(query, {ruta_id: ruta_id});
        return result;
    }

    private calcularMetricasRuta(puntos: any[]): { 
        distanciaTotal: number, 
        tiempoEstimado: number 
    } {
        // Implementación simplificada - deberías usar un servicio real de cálculo de rutas
        let distanciaTotal = 0;
        let tiempoEstimado = 0;
        
        for (let i = 1; i < puntos.length; i++) {
            const distancia = this.calcularDistancia(
                puntos[i-1].latitud,
                puntos[i-1].longitud,
                puntos[i].latitud,
                puntos[i].longitud
            );
            distanciaTotal += distancia;
            tiempoEstimado += distancia * 2; // Supuesto: 2 min por km
        }
        
        return { distanciaTotal, tiempoEstimado };
    }

    private calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
        // Fórmula Haversine simplificada
        const R = 6371; // Radio de la Tierra en km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    private toRad(degrees: number): number {
        return degrees * Math.PI / 180;
    }

    private toDomain(dbData: any): Ruta {
        return {
            id: dbData.id_ruta,
            repartidor: dbData.id_repartidor,
            puntos: dbData.puntos.map((p: any) => ({
                orden: p.orden,
                latitud: parseFloat(p.latitud),
                longitud: parseFloat(p.longitud),
                tiempoEstimado: p.tiempoEstimado,
                tipo: p.tipo,
                referenciaId: p.referenciaId,
                completado: p.completado || false
            })),
            distanciaTotal: parseFloat(dbData.distancia_total),
            tiempoEstimado: dbData.tiempo_estimado,
            estado: dbData.estado,
            fechaCreacion: new Date(dbData.fecha_creacion),
            fechaInicio: dbData.fecha_inicio ? new Date(dbData.fecha_inicio) : undefined,
            fechaFin: dbData.fecha_fin ? new Date(dbData.fecha_fin) : undefined,
            optimizada: dbData.optimizada || false
        };
    }
}
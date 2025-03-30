import { PgEnvioRepository } from "./PgEnvioRepository";
import { DEPENDENCY_CONTAINER } from "@/configuration/DependecyContainer";
import { IDatabase, IMain } from "pg-promise";
import { TYPESDEPENDENCIES } from "@/configuration/TypesDependencies";
import { IRepartidorRepository } from "@/core/domain/repositories/IRepartidorRepository";
import { Repartidor, Ubicacion } from "@/core/domain/entities/Repartidor";

export class PgRepartidorRepository implements IRepartidorRepository {
    private dbRutas = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(
        TYPESDEPENDENCIES.bdRutas,
    );
    async buscarPorId(id: number): Promise<Repartidor | null> {
        const query = `
            SELECT * FROM john_schema.repartidor
            WHERE id_repartidor = $1
        `;
        
        const result = await this.dbRutas.oneOrNone(query, [id]);
        return result
    }
    // Métodos de dominio
    // async asignarEnvioOptimo(envio: Envio): Promise<Repartidor | null> {
    //     try {
    //         await this.dbRutas.query('BEGIN');
            
    //         // 1. Buscar repartidores disponibles con capacidad
    //         // consultar lat y longitud por direccion
    //         const repartidores = await this.encontrarCercanosConCapacidad(
    //             {
    //                 latitud: 1,
    //                 longitud: 1,
    //                 timestamp: new Date
    //             }, 
    //             envio.peso
    //         );

    //         if (repartidores.length === 0) {
    //             return null;
    //         }

    //         // 2. Seleccionar el más cercano (simplificado)
    //         const repartidor = repartidores[0];
            
    //         // 3. Actualizar estado del repartidor
    //         await this.actualizarDisponibilidad(repartidor.id_repartidor, 'ocupado');

    //         // 4. Asignar envío (usando el repositorio de envíos)
    //         const envioRepo = new PgEnvioRepository();
    //         await envioRepo.asignarRepartidor(envio.guia, repartidor.id_repartidor);

    //         await this.dbRutas.query('COMMIT');
    //         return repartidor;
    //     } catch (error) {
    //         await this.dbRutas.query('ROLLBACK');
    //         throw error;
    //     }
    // }

    // async liberarCapacidad(repartidor: Repartidor): Promise<void> {
    //     await this.actualizarDisponibilidad(repartidor.id, 'disponible');
    // }

    // Consultas de dominio

    // async obtenerConRutasActivas(): Promise<Repartidor[]> {
    //     const query = `
    //         SELECT DISTINCT r.* 
    //         FROM john_schema.repartidor r
    //         JOIN john_schema.ruta rt ON r.id_repartidor = rt.id_repartidor
    //         WHERE rt.estado = 'en_progreso'
    //     `;
        
    //     const result = await this.dbRutas.query(query);
    //     return result.rows.map(this.toDomain);
    // }

    // Métodos base
    // async guardar(repartidor: Repartidor): Promise<void> {
    //     const query = `
    //         UPDATE john_schema.repartidor SET
    //             nombre = $1,
    //             telefono = $2,
    //             disponibilidad = $3,
    //             matricula = $4,
    //             capacidad_max = $5,
    //             latitud_actual = $6,
    //             longitud_actual = $7,
    //             updated_at = NOW()
    //         WHERE id_repartidor = $9
    //     `;
        
    //     await this.dbRutas.query(query, [
    //         repartidor.nombre,
    //         repartidor.telefono,
    //         repartidor.disponibilidad,
    //         repartidor.matricula,
    //         repartidor.capacidadMaxima,
    //         repartidor.ubicacionActual?.latitud,
    //         repartidor.ubicacionActual?.longitud,
    //         repartidor.id
    //     ]);
    // }


    // Métodos privados de ayuda
    // private async actualizarDisponibilidad(id: number, estado: string): Promise<void> {
    //     const query = `
    //         UPDATE john_schema.repartidor
    //         SET disponibilidad = $1
    //         WHERE id_repartidor = $2
    //     `;
    //     await this.dbRutas.query(query, [estado, id]);
    // }



    // private toDomain(dbData: any): Repartidor {
    //     return {
    //         id_repartidor: dbData.id_repartidor,
    //         nombre: dbData.nombre,
    //         telefono: dbData.telefono,
    //         disponibilidad: dbData.disponibilidad,
    //         matricula: dbData.matricula,
    //         capacidadMaxima: parseFloat(dbData.capacidad_max),
    //         ubicacionActual: dbData.latitud_actual && dbData.longitud_actual ? {
    //             latitud: parseFloat(dbData.latitud_actual),
    //             longitud: parseFloat(dbData.longitud_actual),
    //             timestamp: new Date
    //         } : undefined,
    //     };
    // }
}
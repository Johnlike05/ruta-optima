import { IEnvioRepository } from "../../../domain/repositories/IEnvioRepository";
import { Envio } from "../../../domain/entities/Envio";
import { IDatabase, IMain } from "pg-promise";
import { DEPENDENCY_CONTAINER } from "@/configuration/DependecyContainer";
import { TYPESDEPENDENCIES } from "@/configuration/TypesDependencies";

export class PgEnvioRepository implements IEnvioRepository {
    private dbRutas = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(
        TYPESDEPENDENCIES.bdRutas,
    );
    // CRUD Básico
    async crear(envio: Envio): Promise<Envio> {
        const query = `
            INSERT INTO john_schema.envio (
                guia,
                direccion_origen,
                direccion_destino,
                peso,
                volumen,
                estado,
                fecha_creacion,
                fecha_entrega_estimada,
                sla,
                id_cliente,
                ciudad_origen,
                ciudad_destino,
                codigo_ciudad_origen,
                codigo_ciudad_destino
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *
        `;
        
        const result = await this.dbRutas.query(query, [
            envio.guia,
            envio.direccionOrigen,
            envio.direccion_destino,
            envio.peso,
            envio.volumen,
            envio.estado,
            envio.fechaCreacion || new Date(),
            envio.fechaEntregaEstimada,
            envio.sla,
            envio.idCliente,
            envio.ciudad_origen,
            envio.ciudad_destino,
            envio.codigo_ciudad_origen,
            envio.codigo_ciudad_destino
        ]);

        return this.toDomain(result.rows[0]);
    }

    async obtenerPorGuia(guia: string): Promise<Envio | null> {
        const query = `
            SELECT * FROM john_schema.envio
            WHERE guia = $1
        `;
        
        const result = await this.dbRutas.query(query, [guia]);
        return result.rows[0] ? this.toDomain(result.rows[0]) : null;
    }

    async actualizar(guia: string, cambios: Partial<Envio>): Promise<void> {
        const campos = [];
        const valores = [];
        let contador = 1;

        // Construcción dinámica de la consulta
        for (const [key, value] of Object.entries(cambios)) {
            if (value !== undefined) {
                campos.push(`${this.mapToDbColumn(key)} = $${contador}`);
                valores.push(value);
                contador++;
            }
        }

        if (campos.length === 0) return;

        const query = `
            UPDATE john_schema.envio
            SET ${campos.join(', ')}
            WHERE guia = $${contador}
        `;
        
        await this.dbRutas.query(query, [...valores, guia]);
    }

    // Búsquedas específicas
    async listarPendientes(): Promise<Envio[]> {
        const query = `
            SELECT * FROM john_schema.envio
            WHERE estado = 'pendiente'
            ORDER BY fecha_creacion ASC
        `;
        
        const result:Envio[] = await this.dbRutas.query(query);
        return result
    }

    async listarPorRepartidor(idRepartidor: number): Promise<Envio[]> {
        const query = `
            SELECT * FROM john_schema.envio
            WHERE id_repartidor = $1
            ORDER BY guia ASC
        `;
        
        const result = await this.dbRutas.query(query, [idRepartidor]);
        return result
    }

    async listarPorCliente(idCliente: number): Promise<Envio[]> {
        const query = `
            SELECT * FROM john_schema.envio
            WHERE id_cliente = $1
            ORDER BY fecha_creacion DESC
        `;
        
        const result = await this.dbRutas.query(query, [idCliente]);
        return result.rows.map(this.toDomain);
    }

    // Operaciones de negocio
    async asignarRepartidor(guia: string, idRepartidor: number): Promise<void> {
        const client = await this.dbRutas.connect();
        try {
            await client.query('BEGIN');
            
            // 1. Verificar que el envío esté pendiente
            const envio = await this.obtenerPorGuia(guia);
            if (!envio || envio.estado !== 'pendiente') {
                throw new Error('Solo se pueden asignar envíos pendientes');
            }

            // 2. Actualizar envío
            await client.query(`
                UPDATE john_schema.envio
                SET id_repartidor = $1,
                    estado = 'asignado'
                WHERE guia = $2
            `, [idRepartidor, guia]);

            // 3. Actualizar repartidor (opcional)
            await client.query(`
                UPDATE john_schema.repartidor
                SET disponibilidad = 'ocupado'
                WHERE id_repartidor = $1
            `, [idRepartidor]);

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
    }

    async cambiarEstado(guia: string, nuevoEstado: Envio): Promise<void> {
        const query = `
            UPDATE john_schema.envio
            SET estado = $1
            WHERE guia = $2
        `;
        
        await this.dbRutas.query(query, [nuevoEstado, guia]);
    }

    // Consultas complejas
    async listarPorPrioridad(slaMax: number): Promise<Envio[]> {
        const query = `
            SELECT * FROM john_schema.envio
            WHERE sla <= $1
            ORDER BY sla ASC, fecha_creacion ASC
        `;
        
        const result = await this.dbRutas.query(query, [slaMax]);
        return result.rows.map(this.toDomain);
    }

    async contarPorEstado(): Promise<{ estado: string; cantidad: number; }[]> {
        const query = `
            SELECT estado, COUNT(*) as cantidad
            FROM john_schema.envio
            GROUP BY estado
        `;
        
        const result = await this.dbRutas.query(query);
        return result.rows;
    }

    // Helpers
    private toDomain(dbData: any): Envio {
        return {
            guia: dbData.guia,
            direccionOrigen: dbData.direccion_origen,
            direccion_destino: dbData.direccion_destino,
            peso: parseFloat(dbData.peso),
            volumen: parseFloat(dbData.volumen),
            estado: dbData.estado,
            fechaCreacion: new Date(dbData.fecha_creacion),
            fechaEntregaEstimada: dbData.fecha_entrega_estimada ? new Date(dbData.fecha_entrega_estimada) : undefined,
            sla: dbData.sla,
            idCliente: dbData.id_cliente,
            id_repartidor: dbData.id_repartidor,
            ciudad_origen: dbData.ciudad_origen,
            ciudad_destino: dbData.ciudad_destino,
            codigo_ciudad_origen: dbData.codigo_ciudad_origen,
            codigo_ciudad_destino: dbData.codigo_ciudad_destino
        };
    }

    private mapToDbColumn(key: string): string {
        const mapping: Record<string, string> = {
            direccionOrigen: 'direccion_origen',
            direccion_destino: 'direccion_destino',
            fechaCreacion: 'fecha_creacion',
            fechaEntregaEstimada: 'fecha_entrega_estimada',
            idCliente: 'id_cliente',
            id_repartidor: 'id_repartidor'
        };
        return mapping[key] || key;
    }
}
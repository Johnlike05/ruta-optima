import { IEnvioRepository } from "../../../domain/repositories/IEnvioRepository";
import { Envio } from "../../../domain/entities/Envio";
import { IDatabase, IMain } from "pg-promise";
import { DEPENDENCY_CONTAINER } from "@/configuration/DependecyContainer";
import { TYPESDEPENDENCIES } from "@/configuration/TypesDependencies";

export class PgEnvioRepository implements IEnvioRepository {
    private dbRutas = DEPENDENCY_CONTAINER.get<IDatabase<IMain>>(
        TYPESDEPENDENCIES.bdRutas,
    );
    async listarPorRepartidor(idRepartidor: number): Promise<Envio[]> {
        const query = `
            SELECT * FROM john_schema.envio
            WHERE id_repartidor = $1
            ORDER BY guia ASC
        `;
        
        const result = await this.dbRutas.query(query, [idRepartidor]);
        return result
    }
}
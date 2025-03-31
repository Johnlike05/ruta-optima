import { DEPENDENCY_CONTAINER } from "@/configuration/DependecyContainer";
import { IDatabase, IMain } from "pg-promise";
import { TYPESDEPENDENCIES } from "@/configuration/TypesDependencies";
import { IRepartidorRepository } from "@/core/domain/repositories/IRepartidorRepository";
import { Repartidor } from "@/core/domain/entities/Repartidor";

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
}
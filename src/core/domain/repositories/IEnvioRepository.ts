import { Envio } from "../entities/Envio"

export interface IEnvioRepository {
    listarPorRepartidor(idRepartidor: number): Promise<Envio[]>;
}
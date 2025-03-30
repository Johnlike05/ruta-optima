import { Envio } from "../entities/Envio"

export interface IEnvioRepository {
    // CRUD Básico
    crear(Ienvio: Envio): Promise<Envio>;
    obtenerPorGuia(guia: string): Promise<Envio | null>;
    actualizar(guia: string, cambios: Partial<Envio>): Promise<void>;
    
    // Búsquedas específicas
    listarPendientes(): Promise<Envio[]>;
    listarPorRepartidor(idRepartidor: number): Promise<Envio[]>;
    listarPorCliente(idCliente: number): Promise<Envio[]>;
    
    // Operaciones de negocio
    asignarRepartidor(guia: string, idRepartidor: number): Promise<void>;
    cambiarEstado(guia: string, nuevoEstado: Envio): Promise<void>;
    
    // Consultas complejas
    listarPorPrioridad(slaMax: number): Promise<Envio[]>;
    contarPorEstado(): Promise<{ estado: string, cantidad: number }[]>;
}
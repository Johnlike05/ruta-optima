import { Envio } from "../entities/Envio";
import { Repartidor, Ubicacion } from "../entities/Repartidor";

export interface IRepartidorRepository {
    // Métodos de dominio (más semánticos)
    // asignarEnvioOptimo(envio: Envio): Promise<Repartidor | null>;
    // liberarCapacidad(repartidor: Repartidor): Promise<void>;
    
    // // Consultas de dominio
    // encontrarCercanosConCapacidad(
    //     ubicacion: Ubicacion, 
    //     capacidadRequerida: number
    // ): Promise<Repartidor[]>;
    
    // obtenerConRutasActivas(): Promise<Repartidor[]>;
    
    // // Métodos base (pueden estar ocultos)
    // guardar(repartidor: Repartidor): Promise<void>;
    buscarPorId(id: number): Promise<Repartidor | null>;
}
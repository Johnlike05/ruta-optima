import { PuntoRuta, Ruta } from "../entities/Ruta";

export interface IRutaRepository {
    // Gestión de rutas
    crearRuta(repartidorId: number, puntos: PuntoRuta[], distancia_total: number, tiempo_estimado: number): Promise<Ruta>;
    consultarRutaDiaria(id_repartidor: number): Promise<number | null>
    obtenerRutaPorId(rutaId: number): Promise<Ruta>

    
    // Optimización
    // recalcularRuta(rutaId: number): Promise<Ruta>;
    // agregarPunto(rutaId: number, punto: PuntoRuta): Promise<void>;
    
    // Consultas
    // obtenerHistorial(repartidorId: number): Promise<Ruta[]>;
    // obtenerRutasConRetraso(): Promise<Ruta[]>;
}
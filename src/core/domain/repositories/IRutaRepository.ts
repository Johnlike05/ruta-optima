import { PuntoRuta, Ruta } from "../entities/Ruta";

export interface IRutaRepository {
    // Gestión de rutas
    crearRuta(repartidorId: number, puntos: PuntoRuta[]): Promise<Ruta>;
    obtenerRutaActiva(repartidorId: number): Promise<Ruta | null>;
    
    // Optimización
    recalcularRuta(rutaId: number): Promise<Ruta>;
    agregarPunto(rutaId: number, punto: PuntoRuta): Promise<void>;
    
    // Consultas
    obtenerHistorial(repartidorId: number): Promise<Ruta[]>;
    obtenerRutasConRetraso(): Promise<Ruta[]>;
    obtenerRutaPorId(rutaId: number): Promise<Ruta>
}
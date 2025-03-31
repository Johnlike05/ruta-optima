import { PuntoRuta, Ruta } from "../entities/Ruta";

export interface IRutaRepository {
    crearRuta(repartidorId: number, puntos: PuntoRuta[], distancia_total: number, tiempo_estimado: number): Promise<Ruta>;
    consultarRutaDiaria(id_repartidor: number): Promise<number | null>
    obtenerRutaPorId(rutaId: number): Promise<Ruta>
}
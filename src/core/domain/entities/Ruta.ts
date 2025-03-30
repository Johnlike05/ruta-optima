import { Repartidor } from "../entities/Repartidor";

export interface Ruta {
    id: number;
    repartidor: Repartidor| number; // Puede ser objeto o solo ID
    puntos: PuntoRuta[];
    distanciaTotal: number; // en kilómetros
    tiempoEstimado: number; // en minutos
    estado: 'planificada' | 'en_progreso' | 'completada' | 'cancelada' | 'suspendida';
    fechaCreacion: Date;
    fechaInicio?: Date;
    fechaFin?: Date;
    optimizada: boolean;
}

export interface PuntoRuta {
    orden?: number;
    latitud: number;
    longitud: number;
    direccion: string;
    tiempoEstimado?: number; // minutos desde inicio de ruta
    referenciaId?: string; // GUIA de envío o ID de cliente
    completado?: boolean;
    horaEstimadaLlegada?: Date;
}

export interface RespuestaPythonOrden{
    optimized_route: number[];
    total_distance_meters: number;
    estimated_time_minutes: number;
  }
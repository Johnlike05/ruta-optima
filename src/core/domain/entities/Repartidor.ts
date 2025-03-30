export type Disponibilidad = 'disponible' | 'en_ruta' | 'inactivo' | 'ocupado';

export interface Repartidor {
    id_repartidor: number;
    nombre: string;
    telefono: string;
    disponibilidad: Disponibilidad;
    matricula: string;
    capacidadMaxima: number;
    latitud_actual: number;
    longitud_actual: number;
    direccion_base: string;
}

export interface Ubicacion {
    latitud: number;
    longitud: number;
    timestamp: Date;
    velocidad?: number;
}
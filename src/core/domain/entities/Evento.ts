export interface Evento {
    id_evento: number,
    tipo: string,
    descripcion: string,
    fecha_hora: Date,
    latitud: number,
    longitud: number,
    id_ruta: number,
    tiempo_estimado: number,
    id_repartidor: number,
    pendiente: boolean,
}
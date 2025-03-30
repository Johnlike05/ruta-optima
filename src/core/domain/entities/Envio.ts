export interface Envio {
    guia: string;
    direccionOrigen: string;
    direccion_destino: string;
    peso: number;
    volumen: number;
    estado: 'pendiente' | 'asignado' | 'en_ruta' | 'entregado' | 'cancelado';
    fechaCreacion: Date;
    fechaEntregaEstimada?: Date;
    sla: number;
    idCliente: number;
    id_repartidor?: number;
    ciudad_origen: string;
    ciudad_destino: string;
    codigo_ciudad_origen: number;
    codigo_ciudad_destino: number
}
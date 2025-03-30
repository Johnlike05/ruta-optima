import { IEventoIn } from "@/core/application/data/in/IEventoIn";

export interface IEventoRepository {
    agregarEvento(data: IEventoIn, id_ruta: number): Promise<void>;
}
import { IEventoIn } from "@/core/application/data/in/IEventoIn";
import { Evento } from "../entities/Evento";

export interface IEventoRepository {
    agregarEvento(data: IEventoIn, id_ruta: number): Promise<void>;
    consultarEventoByRuta(id_ruta: number): Promise<Evento[]>
}
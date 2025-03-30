import { injectable } from "inversify";
import { DEPENDENCY_CONTAINER } from "../../../configuration/DependecyContainer";
import { TYPESDEPENDENCIES } from "@/configuration/TypesDependencies";
import { PgRepartidorRepository } from "@/core/infrastructure/bd/repositories/PgRepartidorRepository";
import { IEventoIn } from "../data/in/IEventoIn";
import { PgEventoRepository } from "@/core/infrastructure/bd/repositories/PgEventoRepository";
@injectable()
export class EventoAppService {
  private eventoRepository = DEPENDENCY_CONTAINER.get<PgEventoRepository>(
    TYPESDEPENDENCIES.IEventoRepository
  );
  private repartidorRepository = DEPENDENCY_CONTAINER.get<PgRepartidorRepository>(
    TYPESDEPENDENCIES.IRepartidorRepository
  );

  async agregarEvento(data: IEventoIn): Promise<string | null> {
    
    try {
      const repartidorRuta = await this.repartidorRepository.consultarRutaDiaria(data.id_repartidor);
      if (repartidorRuta) {
        await this.eventoRepository.agregarEvento(data, repartidorRuta);
        return "Guardado con exito";
      }
      return null
    } catch (error) {
      console.log('Error en agregarEvento porque el repartidor no tiene rutas asignadas');
      return null;
    }
  }
}

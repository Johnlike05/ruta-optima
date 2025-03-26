import { injectable } from 'inversify';
import { DEPENDENCY_CONTAINER } from '../../../configuration/DependecyContainer';
import { Response } from '../common/response';
import { Result } from '../common/result';
import { IEquipoIn } from '../data/in/IEquipoIn';
// import { EliminarGuiaEntregada } from './../../infrastructure/api-client/EliminarGuiaEntregada';
// import { EntregarMasivaRepository } from '@domain/repository';
// import { Result, Response } from '@domain/response';
// import { IEntregarMasivasIn } from '@application/data/in/IEntregarMasivaIn';
// import { ICerrarMasivasIn } from '@application/data/in/ICerrarMasivaIn';
// import { IPublicarEntregasIn } from '@application/data/in/IPublicarEntregasIn';
// import { PublicarLegalizacion } from '@infrastructure/pubsub/PublicarLegalizacion';
// import { IPublicarCierreIn } from '@application/data/in/IPublicarCierreIn';
// import { ConsultarGuiaEntregada } from '@infrastructure/api-client';
// import { ICerrarGuiasIn, IRegisterInNys } from '@application/data/in/IRegisterIn';
// import axios from 'axios';
// import { URL_REGISTRAR_NOVEDAD } from '@util';

@injectable()
export class CalcularRutasAppService {
    // private entregarRepository = DEPENDENCY_CONTAINER.get<EntregarMasivaRepository>(TYPES.entregarMasivaRepository);
    // publicar = DEPENDENCY_CONTAINER.get(PublicarLegalizacion);
    // guaEntregada = DEPENDENCY_CONTAINER.get(ConsultarGuiaEntregada);
    // eliminarGuia = DEPENDENCY_CONTAINER.get(EliminarGuiaEntregada);

    async rutaOptima(data: IEquipoIn): Promise<Response<string | null>> {
        try {
            return Result.ok(`Las guias seleccionadas han sido procesadas con éxito`);
        } catch (error) {
            console.log('Error No se pudo consultar la ruta', error);
            return Result.ok(null);
        }
    }
}

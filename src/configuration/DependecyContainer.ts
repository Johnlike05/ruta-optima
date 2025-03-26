import { Container } from 'inversify';
import { CalcularRutasAppService } from '../core/application/services';

export const DEPENDENCY_CONTAINER = new Container();

export const createDependencyContainer = (): void => {
    DEPENDENCY_CONTAINER.bind(CalcularRutasAppService).toSelf().inSingletonScope();
    // DEPENDENCY_CONTAINER.bind<Firestore>(TYPES.Firestore).toConstantValue(firestore);
    // DEPENDENCY_CONTAINER.bind<EntregarMasivaRepository>(TYPES.entregarMasivaRepository)
    //     .to(entregarMasivaRepository)
    //     .inSingletonScope();
    // DEPENDENCY_CONTAINER.bind<PubSub>(TYPES.PubSub).toConstantValue(pubsub);
    // DEPENDENCY_CONTAINER.bind(PublicarLegalizacion).toSelf().inSingletonScope();
    // DEPENDENCY_CONTAINER.bind(ConsultarGuiaEntregada).toSelf().inSingletonScope();
    // DEPENDENCY_CONTAINER.bind(EliminarGuiaEntregada).toSelf().inSingletonScope();
};

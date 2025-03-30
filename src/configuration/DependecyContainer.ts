import { Container } from 'inversify';
import { IDatabase, IMain } from 'pg-promise';
import { TYPESDEPENDENCIES } from './TypesDependencies';
import { PgRepartidorRepository } from '@core/infrastructure/bd/repositories/PgRepartidorRepository';
import { PgEnvioRepository } from '@core/infrastructure/bd/repositories/PgEnvioRepository';
import { bdRutas } from '@core/infrastructure/bd/adapter/Config';
import { CalcularRutasAppService } from '@/core/application/services';
import { PgRutaRepository } from '@/core/infrastructure/bd/repositories/PgRutaRepository';
import { PgGeolocalizarRepository } from '@/core/infrastructure/bd/repositories/PgGeolocalizarRepository';
import { GeolocalizarService } from '@/core/application/services/GeolocalizarService';
import { adapter } from '@/core/infrastructure/bd/adapter/RedisConfig';
import { CacheGenericDao } from '@/core/infrastructure/bd/repositories/CacheGenericDao';
import { CacheRepository } from '@/core/domain/repositories/CacheRepository';
import { EventoAppService } from '@/core/application/services/EventoAppService';
import { PgEventoRepository } from '@/core/infrastructure/bd/repositories/PgEventoRepository';
export const DEPENDENCY_CONTAINER = new Container();

export const createDependencyContainer = (): void => {
    DEPENDENCY_CONTAINER.bind(CalcularRutasAppService).toSelf().inSingletonScope();
    DEPENDENCY_CONTAINER.bind(EventoAppService).toSelf().inSingletonScope();
    DEPENDENCY_CONTAINER.bind(GeolocalizarService).toSelf().inSingletonScope();
    DEPENDENCY_CONTAINER.bind<IDatabase<IMain>>(TYPESDEPENDENCIES.bdRutas).toConstantValue(bdRutas);
    DEPENDENCY_CONTAINER.bind(TYPESDEPENDENCIES.CacheAdapter).toConstantValue(adapter);
    DEPENDENCY_CONTAINER.bind<PgRepartidorRepository>(TYPESDEPENDENCIES.IRepartidorRepository)
    .to(PgRepartidorRepository)
    .inSingletonScope();
    DEPENDENCY_CONTAINER.bind<PgEnvioRepository>(TYPESDEPENDENCIES.IEnvioRepository)
    .to(PgEnvioRepository)
    .inSingletonScope();
    DEPENDENCY_CONTAINER.bind<PgRutaRepository>(TYPESDEPENDENCIES.IRutaRepository)
    .to(PgRutaRepository)
    .inSingletonScope();
    DEPENDENCY_CONTAINER.bind<PgEventoRepository>(TYPESDEPENDENCIES.IEventoRepository)
    .to(PgEventoRepository)
    .inSingletonScope();
    DEPENDENCY_CONTAINER.bind<PgGeolocalizarRepository>(TYPESDEPENDENCIES.IGeolocalizarRepository)
    .to(PgGeolocalizarRepository)
    .inSingletonScope();
    DEPENDENCY_CONTAINER.bind<CacheRepository>(TYPESDEPENDENCIES.CacheGenericDao)
        .to(CacheGenericDao)
        .inSingletonScope();

    // DEPENDENCY_CONTAINER.bind<Firestore>(TYPES.Firestore).toConstantValue(firestore);
    // DEPENDENCY_CONTAINER.bind<EntregarMasivaRepository>(TYPES.entregarMasivaRepository)
    //     .to(entregarMasivaRepository)
    //     .inSingletonScope();
    // DEPENDENCY_CONTAINER.bind<PubSub>(TYPES.PubSub).toConstantValue(pubsub);
    // DEPENDENCY_CONTAINER.bind(PublicarLegalizacion).toSelf().inSingletonScope();
    // DEPENDENCY_CONTAINER.bind(ConsultarGuiaEntregada).toSelf().inSingletonScope();
    // DEPENDENCY_CONTAINER.bind(EliminarGuiaEntregada).toSelf().inSingletonScope();
};

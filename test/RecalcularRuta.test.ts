import 'reflect-metadata';
import { IDatabase, IMain } from 'pg-promise';
import { createDependencyContainer, DEPENDENCY_CONTAINER } from '../src/configuration/DependecyContainer';
import { TYPESDEPENDENCIES } from '../src/configuration/TypesDependencies';
import { application } from '../src/app';
import { crearDB } from './crear-pg-mem';

describe('pruebas unitarias a endpoints', () => {
    const db = crearDB();
    beforeAll(async () => {
        createDependencyContainer();
        DEPENDENCY_CONTAINER.unbind(TYPESDEPENDENCIES.bdRutas); // Elimina la instancia anterior
        DEPENDENCY_CONTAINER.bind<IDatabase<IMain>>(TYPESDEPENDENCIES.bdRutas).toConstantValue(db);
    });

    it('Deberia devolver que no encontro ruta', async () => {
        const response = await application.inject({
            method: 'GET',
            url: `${process.env.PREFIX_URL}/recalcular_ruta/321`,
        });

        const result = await response.json();
        expect(result.response).toEqual('No se encontro ruta actual para el repartidor enviado');
        expect(response.statusCode).toEqual(200);
    });

    it('Deberia devolver que no encontro ruta', async () => {
        const response = await application.inject({
            method: 'GET',
            url: `${process.env.PREFIX_URL}/recalcular_ruta/555`,
        });

        const result = await response.json();
        expect(result.response).toEqual('Eventos agregados a la ruta');
        expect(response.statusCode).toEqual(200);
    });
});

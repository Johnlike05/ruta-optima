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

    it('Debería retornar que no se pudo registrar el evento', async () => {
        const response = await application.inject({
            method: 'POST',
            url: `${process.env.PREFIX_URL}/agregar_evento`,
            payload: {
                "tipo": "tiempo",
                "descripcion": "trancon en la 80",
                "latitud": 23.21111,
                "longitud": 53.2222,
                "tiempo_estimado": 28,
                "id_repartidor": 321
            }
        });

        const result = await response.json();
        console.log('result', result);

        expect(response.statusCode).toEqual(200);
        expect(result.response).toEqual('No se pudo registrar el evento');
    });

    it('Debería retornar que si se pudo registrar el evento', async () => {
        const response = await application.inject({
            method: 'POST',
            url: `${process.env.PREFIX_URL}/agregar_evento`,
            payload: {
                "tipo": "tiempo",
                "descripcion": "trancon en la 80",
                "latitud": 23.21111,
                "longitud": 53.2222,
                "tiempo_estimado": 28,
                "id_repartidor": 555
            }
        });

        const result = await response.json();
        console.log('result', result);

        expect(response.statusCode).toEqual(200);
        expect(result.response).toEqual('Guardado con exito');
    });
});

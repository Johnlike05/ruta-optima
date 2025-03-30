import { agregarEventoRouter } from './agregarEventoRouter';
import { calcularRutaOptimaRouter } from './calcularRutaOptimaRouter';
import { FastifyInstance } from 'fastify';

//acá va el schema
export const initRoutes = async (application: FastifyInstance): Promise<void> => {
    application.get(`/calcular_ruta_optima/:id_repartidor`, calcularRutaOptimaRouter);
    application.post(`/agregar_evento`, agregarEventoRouter);

    //  application.post(`/`, examplePostSchema, example);
};

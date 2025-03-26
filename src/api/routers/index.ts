import { calcularRutaOptima } from './calcularRouter';
import { FastifyInstance } from 'fastify';

//acá va el schema
export const initRoutes = async (application: FastifyInstance): Promise<void> => {
    application.post(`/calcular_ruta_optima`, calcularRutaOptima);
    //  application.post(`/`, examplePostSchema, example);
};

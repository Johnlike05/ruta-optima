import { agregarEventoRouter } from './agregarEventoRouter';
import { calcularRutaOptimaRouter, recalcularRutaRouter } from './calcularRutaOptimaRouter';
import { FastifyInstance } from 'fastify';

//acá va el schema
export const initRoutes = async (application: FastifyInstance): Promise<void> => {
    application.get(`/calcular_ruta_optima/:id_repartidor`, calcularRutaOptimaRouter);
    application.post(`/agregar_evento`, agregarEventoRouter);
    application.get(`/recalcular_ruta/:id_repartidor`, recalcularRutaRouter);
};

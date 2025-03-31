import { FastifyRequest, FastifyReply } from 'fastify';
import { validateData } from '../../shared/validations/validator';
import { DEPENDENCY_CONTAINER } from '../../configuration/DependecyContainer';
import { CalcularRutasAppService } from '../../core/application/services';
import { IEquipoInSchema } from '../schemas/IEquipoInSchema';
import { IEquipoIn } from '../../core/application/data/in/IEquipoIn';

export const calcularRutaOptimaRouter = async (req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply | void> => {
    const entregarMasiva = DEPENDENCY_CONTAINER.get(CalcularRutasAppService);
    const data = validateData<IEquipoIn>(IEquipoInSchema, req.params);
    const response = await entregarMasiva.rutaOptima(data);
    if (response) {
        return reply.send({ ...response, id: req.id });
    }
    return reply.send({ response: 'No se pudo generar guias por que el repartidor no tiene envios asignados hoy', id: req.id });
};

export const recalcularRutaRouter = async (req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply | void> => {
    const entregarMasiva = DEPENDENCY_CONTAINER.get(CalcularRutasAppService);
    const data = validateData<IEquipoIn>(IEquipoInSchema, req.params);
    const response = await entregarMasiva.recalcularRuta(data);
    if (response) {
        return reply.send({ response: response, id: req.id });
    }
    return reply.send({ response: 'No se pudo generar guias por que el repartidor no tiene envios asignados hoy', id: req.id });
};

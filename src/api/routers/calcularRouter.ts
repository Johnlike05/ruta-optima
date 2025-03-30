import { FastifyRequest, FastifyReply } from 'fastify';
import { validateData } from '../../shared/validations/validator';
import { DEPENDENCY_CONTAINER } from '../../configuration/DependecyContainer';
import { CalcularRutasAppService } from '../../core/application/services';
import { IEquipoInSchema } from '../schemas/IEquipoInSchema';
import { IEquipoIn } from '../../core/application/data/in/IEquipoIn';

export const calcularRutaOptima = async (req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply | void> => {
    const entregarMasiva = DEPENDENCY_CONTAINER.get(CalcularRutasAppService);
    const data = validateData<IEquipoIn>(IEquipoInSchema, req.body);
    const response = await entregarMasiva.rutaOptima(data);
    if (response) {
        return reply.send({ ...response, id: req.id });
    }
    return reply.send({ respuesta: 'No se pudo generar guias por que el repartidor no tiene envios asignados hoy', id: req.id });
};

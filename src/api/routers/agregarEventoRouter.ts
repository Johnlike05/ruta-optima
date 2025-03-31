import { FastifyRequest, FastifyReply } from 'fastify';
import { validateData } from '../../shared/validations/validator';
import { DEPENDENCY_CONTAINER } from '../../configuration/DependecyContainer';
import { EventoAppService } from '@/core/application/services/EventoAppService';
import { IEventoIn } from '@/core/application/data/in/IEventoIn';
import { IEventoInSchema } from '../schemas/IEventoInSchema';

export const agregarEventoRouter = async (req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply | void> => {
    const eventoService = DEPENDENCY_CONTAINER.get(EventoAppService);
    const data = validateData<IEventoIn>(IEventoInSchema, req.body);
    const response = await eventoService.agregarEvento(data);
    if (response) {
        return reply.send({ response: response, id: req.id });
    }
    return reply.send({ response: 'No se pudo registrar el evento', id: req.id });
};

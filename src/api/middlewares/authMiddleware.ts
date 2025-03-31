import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function authMiddleware(fastify: FastifyInstance) {
  fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ message: "No autorizado" });
    }
  });
}

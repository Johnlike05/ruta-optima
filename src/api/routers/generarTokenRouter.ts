import { FastifyRequest, FastifyReply } from "fastify";

export const generarTokenHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const user = { id: 1, username: "testuser" }; // Datos de prueba
  const token = (req.server as any).jwt.sign(user, { expiresIn: "1h" });

  reply.send({ token });
};

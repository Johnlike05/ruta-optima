import "@fastify/jwt";
import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: any) => Promise<void>;
  }
}

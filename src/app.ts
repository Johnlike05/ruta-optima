import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import { randomBytes } from "crypto";
require('module-alias/register');
import { initRoutes } from "./api/routers";
import { swagger_config } from "./plugin/swagger";
import fastifyJwt from "@fastify/jwt";  
import { PREFIX } from "./util/Envs";
import { middlewares } from './api/middlewares/CommonMiddleware';
export const application = fastify({
  genReqId: (_) => randomBytes(20).toString("hex"),
});

application.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || "tu_secreto_super_seguro", // Usa variables de entorno para seguridad
});
application.decorate("authenticate", async function (request:any, reply:any) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: "Token no autorizado, hable con el administrador" });
  }
});
middlewares(application);

application.register(fastifySwagger, swagger_config);

application.register(initRoutes, { prefix: PREFIX });

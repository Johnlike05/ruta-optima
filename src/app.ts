import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import fastify from "fastify";
import { randomBytes } from "crypto";
require('module-alias/register');
import { initRoutes } from "./api/routers";
import fastifyJwt from "@fastify/jwt";  
import { PREFIX } from "./util/Envs";
import { middlewares } from './api/middlewares/CommonMiddleware';
export const application = fastify({
  genReqId: (_) => randomBytes(20).toString("hex"),
});
application.addHook('onRoute', (routeOptions) => {
  console.log(routeOptions.url);
});


application.register(fastifyJwt, {
  secret: 'clave-prueba',
});
application.decorate("authenticate", async function (request:any, reply:any) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: "Token no autorizado, hable con el administrador" });
  }
});
middlewares(application);

application.register(initRoutes, { prefix: PREFIX });

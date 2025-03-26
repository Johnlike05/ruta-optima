// libraries
import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import { randomBytes } from "crypto";
// import { PREFIX } from '@util';
// import { middlewares, errorHandler } from '@infrastructure/api/middlewares';
import { initRoutes } from "./api/routers";
import { swagger_config } from "./plugin/swagger";
import { PREFIX } from "./util/Envs";
import { middlewares } from './api/middlewares/CommonMiddleware';
export const application = fastify({
  genReqId: (_) => randomBytes(20).toString("hex"),
});

// middlewares
middlewares(application);
// errorHandler(application);

//fastify swagger
application.register(fastifySwagger, swagger_config);

// routes
application.register(initRoutes, { prefix: PREFIX });

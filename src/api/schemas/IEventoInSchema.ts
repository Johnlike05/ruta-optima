import { IEventoIn } from "@/core/application/data/in/IEventoIn";
import Joi from "joi";

export const IEventoInSchema = Joi.object<IEventoIn>({
  tipo: Joi.string().required().example('tiempo'),
  descripcion: Joi.string().required().example('Aguacero en la 26'),
  latitud: Joi.number().required().example(32.3432),
  longitud: Joi.number().required().example(-54.2232),
  tiempo_estimado: Joi.number().required().example(35),
  id_repartidor: Joi.number().required().example(123),
});

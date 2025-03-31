import Joi from "joi";
import { IEquipoIn } from "../../core/application/data/in/IEquipoIn";

export const IEquipoInSchema = Joi.object<IEquipoIn>({
  id_repartidor: Joi.number().required().example(3),
});

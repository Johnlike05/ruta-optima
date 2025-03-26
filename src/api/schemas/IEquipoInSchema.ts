import Joi from "joi";
import { IEquipoIn } from "../../core/application/data/in/IEquipoIn";

export const IEquipoInSchema = Joi.object<IEquipoIn>({
  codigo_equipo: Joi.string().required().example("23"),
});

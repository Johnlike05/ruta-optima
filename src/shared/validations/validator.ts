import Joi from 'joi';
import { BadMessageException } from '../exceptions/Exceptions';

type Schema = Joi.ObjectSchema | Joi.ArraySchema;
type Body = Record<string, unknown> | undefined | unknown;

export const validateData = <T>(schema: Schema, dataToValidate: Body): T => {
    
    if (dataToValidate) {
        const { error, value } = schema.validate(dataToValidate, { convert: true });
        if (error) {
            console.error(`schemaError: ${JSON.stringify(error)}`);
            throw new BadMessageException(error.message, 'Los valores de entrada no son correctos.');
        }
        return value;
    }
    throw new Error('mensaje indefinido');
};

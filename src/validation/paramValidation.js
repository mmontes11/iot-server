import Joi from 'joi';
import regex from '../validation/regex';

export default {
    createUser: {
        body: {
            userName: Joi.string().required(),
            password: Joi.string().regex(regex.passwordRegex).required()
        }
    },
    createMeasurement: {
        body: {
            type: Joi.string().required(),
            units: Joi.string().required(),
            value: Joi.number().required()
        }
    },
    createEvent: {
        body: {
            type: Joi.string().required()
        }
    }
};

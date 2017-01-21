import Joi from 'joi';
import regex from '../validation/regex';

export default {
    createUser: {
        body: {
            userName: Joi.string().required(),
            password: Joi.string().regex(regex.passwordRegex)
        }
    }
};

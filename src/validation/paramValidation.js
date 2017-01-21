import Joi from 'joi';
import regex from '../validation/regex';

const paramValidation = {
    createUser: {
        body: {
            userName: Joi.string().required(),
            password: Joi.string().regex(regex.passwordRegex)
        }
    }
};

export default paramValidation;

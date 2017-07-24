import mongoose from '../../../config/mongoose';
import regex from '../../validation/regex'

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        match: regex.passwordRegex
    },
    creationTime: {
        type: Date,
        default: Date.now()
    }
});
const UserModel = mongoose.model('User', UserSchema);

export default { UserSchema, UserModel };


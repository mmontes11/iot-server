import mongoose from 'mongoose';
import regex from '../validation/regex'

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        match: [regex.passwordRegex, 'Invalid {PATH}. It must contain uppercase letters, lowercase letters, numbers and symbols.']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model('User', UserSchema);


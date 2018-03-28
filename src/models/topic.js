import mongoose from '../lib/mongoose';

const TopicSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    }
});
const TopicModel = mongoose.model('Topic', TopicSchema);

export { TopicSchema, TopicModel };
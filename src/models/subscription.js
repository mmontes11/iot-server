import mongoose from '../lib/mongoose';

const SubscriptionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    chatId: {
        type: Number,
        required: true
    },
    thing: {
        type: String,
        required: true
    },
    observationType: {
        type: String,
        required: true
    }
});

SubscriptionSchema.index({ type: 1, chatId: 1, thing: 1, observationType: 1 }, { unique: true });

SubscriptionSchema.statics.findSubscription = function (subscription) {
    const findCriteria = {
        type: subscription.type,
        chatId: subscription.chatId,
        thing: subscription.thing,
        observationType: subscription.observationType
    };
    return this.findOne(findCriteria);
};

const SubscriptionModel = mongoose.model('Subscription', SubscriptionSchema);

export { SubscriptionSchema, SubscriptionModel };
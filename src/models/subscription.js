import mongoose from '../lib/mongoose';

const SubscriptionSchema = new mongoose.Schema({
    notificationType: {
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

SubscriptionSchema.index({ notificationType: 1, chatId: 1, thing: 1, observationType: 1 }, { unique: true });

SubscriptionSchema.statics.findSubscription = function (subscription) {
    const findCriteria = {
        notificationType: subscription.notificationType,
        chatId: subscription.chatId,
        thing: subscription.thing,
        observationType: subscription.observationType
    };
    return this.findOne(findCriteria);
};

SubscriptionSchema.statics.findSubscriptionById = function (subscriptionId) {
    const objectId = mongoose.Types.ObjectId(subscriptionId);
    return this.findOne(objectId);
};

const SubscriptionModel = mongoose.model('Subscription', SubscriptionSchema);

export { SubscriptionSchema, SubscriptionModel };
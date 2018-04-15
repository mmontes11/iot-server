import { SubscriptionModel } from "../../models/subscription";
import { TopicModel } from "../../models/topic";
import modelFactory from "../../models/modelFactory";
import responseHandler from "../../helpers/responseHandler";
import _ from "underscore";
import httpStatus from "http-status";

const createSubscription = async (req, res, next) => {
    try {
        const subscription = req.body;
        if (_.isUndefined(subscription.topic) && !_.isUndefined(subscription.topicId)) {
            const topic = await TopicModel.findTopicById(subscription.topicId);
            subscription.topic = topic.topic;
        }
        const foundSubscription = await SubscriptionModel.findSubscription(subscription);
        if (_.isNull(foundSubscription)) {
            const newSubscription = modelFactory.createSubscription(subscription);
            const savedSubscription = await newSubscription.save();
            res.status(httpStatus.CREATED).json(savedSubscription);
        } else {
            res.status(httpStatus.CONFLICT).json(foundSubscription)
        }
    } catch (err) {
        responseHandler.handleError(res, err);
    }
};

const deleteSubscription = async (req, res, next) => {
    const subscriptionId = req.params.id;
    try {
        const foundSubscription = await SubscriptionModel.findSubscriptionById(subscriptionId);
        if (!_.isNull(foundSubscription)) {
            await foundSubscription.remove();
            res.sendStatus(httpStatus.OK);
        } else {
            res.sendStatus(httpStatus.NOT_FOUND);
        }
    } catch (err) {
        responseHandler.handleError(res, err);
    }
};

export default { createSubscription, deleteSubscription };
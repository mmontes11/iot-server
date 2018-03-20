import { SubscriptionModel } from "../../models/subscription";
import httpStatus from 'http-status';
import responseHandler from "../../helpers/responseHandler";
import responseKeys from '../../utils/responseKeys';

const getSubscriptionsByChat = async (req, res, next) => {
    const chatId = parseInt(req.query.chatId);
    try {
        const subscriptions = await SubscriptionModel.find({ chatId });
        responseHandler.handleResponse(res, subscriptions, responseKeys.subscriptionsArrayKey);
    } catch (err) {
        responseHandler.handleError(res, err);
    }
};

export default { getSubscriptionsByChat };
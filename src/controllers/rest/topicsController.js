import { TopicModel } from "../../models/topic";
import responseHandler from "../../helpers/responseHandler";
import responseKeys from "../../utils/responseKeys";

const getTopics = async (req, res) => {
    const topics = await TopicModel.find({});
    responseHandler.handleResponse(res, topics, responseKeys.topicsArrayKey)
};

export default { getTopics };
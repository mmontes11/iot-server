import _ from "underscore";
import { TimePeriod, CustomTimePeriod} from "../models/timePeriod"
import httpStatus from 'http-status';

function validateGetStats(req, res, next) {
    if (!_.isUndefined(req.query.lastTimePeriod)) {
        const lastTimePeriod = new TimePeriod(req.query.lastTimePeriod);
        if (!lastTimePeriod.isValid()) {
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }
    }
    next()
}

export default { validateGetStats }

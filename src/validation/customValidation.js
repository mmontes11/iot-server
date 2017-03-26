import _ from "underscore";
import { TimePeriod, CustomTimePeriod} from "../models/timePeriod"
import httpStatus from 'http-status';

function validateGetStats(req, res, next) {
    const lastTimePeriodString = req.query.lastTimePeriod;
    if (!_.isUndefined(lastTimePeriodString)) {
        const lastTimePeriod = new TimePeriod(lastTimePeriodString);
        if (!lastTimePeriod.isValidTimePeriod()) {
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }
    }
    next()
}

export default { validateGetStats }

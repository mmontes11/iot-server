import _ from "underscore";
import { TimePeriod, CustomTimePeriod } from "../models/request/timePeriod"
import httpStatus from 'http-status';

function validateGetStats(req, res, next) {
    const lastTimePeriodParam = req.query.lastTimePeriod;
    const startDateParam = req.query.startDate;
    const endDateParam = req.query.endDate;

    if (!_.isUndefined(lastTimePeriodParam)) {
        if (!_.isUndefined(startDateParam) || !_.isUndefined(endDateParam)) {
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }
        const lastTimePeriod = new TimePeriod(lastTimePeriodParam);
        if (!lastTimePeriod.isValid()) {
            return res.sendStatus(httpStatus.BAD_REQUEST)
        }
    }

    if (!_.isUndefined(startDateParam) || !_.isUndefined(endDateParam)) {
        const timePeriod = new CustomTimePeriod(startDateParam, endDateParam);
        if (!timePeriod.isValid()) {
            return res.sendStatus(httpStatus.BAD_REQUEST);
        }
    }

    next()
}

export default { validateGetStats }

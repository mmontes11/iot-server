import moment from "moment";
import _ from "underscore";

const hourString = "hour", dayString = "day", weekString = "week", monthString = "month", yearString = "year";
const validTimePeriods = [hourString, dayString, weekString, monthString, yearString];
const supportedDateFormats = [moment.ISO_8601, "MM-DD-YYYY"];

class TimePeriod {
    constructor(timePeriodString){
        if (!_.isUndefined(timePeriodString)) {
            this.name = TimePeriod._normalizeTimePeriod(timePeriodString);
            this.startDate = moment().utc().subtract(1, this.name);
        }
        this.endDate = moment().utc();
    }
    static _normalizeTimePeriod(timePeriodString) {
        if (validTimePeriods.includes(timePeriodString)) {
            return timePeriodString;
        } else {
            return undefined
        }
    }
    isValid() {
        return !_.isUndefined(this.name);
    }
}

class CustomTimePeriod extends TimePeriod {
    constructor(startDate, endDate) {
        super();
        if (!_.isUndefined(startDate)) {
            this.startDate = moment(startDate, supportedDateFormats).utc();
        }
        if (!_.isUndefined(endDate)) {
            this.endDate = moment(endDate, supportedDateFormats).utc();
        }
    }
    isValid() {
        if (!_.isUndefined(this.startDate) && !this.startDate.isValid()) {
            return false
        }
        if (!_.isUndefined(this.endDate) && !this.endDate.isValid()) {
            return false
        }
        if (!_.isUndefined(this.startDate) && !_.isUndefined(this.endDate)) {
            return this.endDate.isAfter(this.startDate)
        }
        return true;
    }
}

export { TimePeriod, CustomTimePeriod };
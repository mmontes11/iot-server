import Enum from "es6-enum";
import moment from "moment";
import _ from "underscore";

const dayString = "day", weekString = "week", monthString = "month", yearString = "year";
const TIME_PERIOD = Enum(dayString, weekString, monthString, yearString);
const supportedDateFormats = [moment.ISO_8601, "MM-DD-YYYY"];

class TimePeriod {
    constructor(timePeriodString){
        if (!_.isUndefined(timePeriodString)) {
            this.name = timePeriodString;
            this.value = TimePeriod._stringToEnum(timePeriodString);
            this.startDate = moment().utc().subtract(1, this.name);
        }
        this.endDate = moment().utc();
    }
    static _stringToEnum(timePeriodString) {
        switch (timePeriodString) {
            case dayString:
                return TIME_PERIOD.day;
            case weekString:
                return TIME_PERIOD.week;
            case monthString:
                return TIME_PERIOD.month;
            case yearString:
                return TIME_PERIOD.year;
            default:
                return undefined
        }
    }
    isValid() {
        return !_.isUndefined(this.name) && !_.isUndefined(this.value)
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
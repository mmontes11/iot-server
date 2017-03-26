import Enum from "es6-enum";
import moment from "moment";
import _ from "underscore";

const dayString = "day", weekString = "week", monthString = "month", yearString = "year";
const TIME_PERIOD = Enum(dayString, weekString, monthString, yearString);

class TimePeriod {
    constructor(timePeriodString){
        this.name = timePeriodString;
        this.value = this.stringToEnum(timePeriodString);
        this.startDate = this.getStartDate();
        this.endDate = moment().utc().toDate();
    }
    stringToEnum(timePeriodString) {
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
    getStartDate() {
        return moment().utc().subtract(1, this.name).toDate();
    }
}

class CustomTimePeriod extends TimePeriod {
    constructor(startDate, endDate) {
        super();
        this.startDate = startDate;
        this.endDate = endDate;
    }
    isValid() {
        return false
    }
}

export default { TimePeriod, CustomTimePeriod };
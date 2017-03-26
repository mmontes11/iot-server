import Enum from "es6-enum";

const dayString = "day", weekString = "week", monthString = "month", yearString = "year";
const TIME_PERIOD = Enum(dayString, weekString, monthString, yearString);

class TimePeriod {
    constructor(timePeriodString){
        this.value = this.stringToEnum(timePeriodString)
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
        return this.value != undefined
    }
}

export default TimePeriod;
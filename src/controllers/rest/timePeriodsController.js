import { TimePeriod } from "../../models/timePeriod";
import responseKeys from "../../utils/responseKeys";

const getTimePeriods = (req, res, next) =>
  res.send({
    [responseKeys.timePeriodsArrayKey]: TimePeriod.supportedTimePeriods(),
  });

export default { getTimePeriods };

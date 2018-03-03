const stringIsBoolean = (string) => {
    return string === "true" || string === "false";
};

const stringToBoolean = (string) => {
    return string === "true";
};

export default { stringIsBoolean, stringToBoolean };
const ObservationKind = Object.freeze({
    measurementKind: "measurement",
    eventKind: "event"
});
const supportedObservationKinds = Object.values(ObservationKind);

export {
    ObservationKind,
    supportedObservationKinds
};
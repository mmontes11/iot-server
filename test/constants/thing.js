export default {
    thingAtACoruna: {
        name: 'raspi-coruna',
        ip: '192.168.0.1',
        geometry : {
            type : 'Point',
            coordinates : [
                -8.4065665,
                43.3682188
            ]
        },
        supportedObservationTypes: {
            measurement: [
                "temperature",
                "humidity"
            ],
            event: []
        }
    },
    thingAtACoruna2: {
        name: 'raspi-coruna2',
        ip: '192.168.0.1',
        geometry : {
            type : 'Point',
            coordinates : [
                -8.40,
                43.38
            ]
        },
        supportedObservationTypes: {
            measurement: [
                "temperature",
                "humidity"
            ],
            event: []
        }
    },
    thingAtNYC: {
        name: 'raspi-nyc',
        ip: '192.168.0.1',
        geometry : {
            type : 'Point',
            coordinates : [
                -74.25,
                40.69
            ]
        },
        supportedObservationTypes: {
            measurement: [
                "temperature",
                "humidity"
            ],
            event: []
        }
    },
    thingAtTokyo: {
        name: 'raspi-tokyo',
        ip: '192.168.0.1',
        geometry : {
            type : 'Point',
            coordinates : [
                139.57,
                35.67
            ]
        },
        supportedObservationTypes: {
            measurement: [
                "temperature",
                "humidity"
            ],
            event: []
        }
    },
    thingWithEvents: {
        name: 'raspi-events',
        ip: '192.168.0.1',
        geometry : {
            type : 'Point',
            coordinates : [
                144.9347428,
                -37.8254904
            ]
        },
        supportedObservationTypes: {
            event: [
                "door-opened",
                "door-closed"
            ]
        }
    },
    thingWithEventsAndMeasurements: {
        name: 'raspi-events-measurements',
        ip: '192.168.0.1',
        geometry : {
            type : 'Point',
            coordinates : [
                144.9347428,
                -37.8254904
            ]
        },
        supportedObservationTypes: {
            measurement: [
                "temperature",
                "humidity"
            ],
            event: [
                "door-opened",
                "door-closed"
            ]
        }
    },
    thingWithEventsAndMeasurements2: {
        name: 'raspi-events-measurements2',
        ip: '192.168.0.1',
        geometry : {
            type : 'Point',
            coordinates : [
                144.9347428,
                -37.8254904
            ]
        },
        supportedObservationTypes: {
            measurement: [
                "temperature",
                "humidity"
            ],
            event: [
                "door-opened",
                "door-closed"
            ]
        }
    },
    invalidSupportsMeasurementsQueryParam: "foo",
    invalidSupportsEventsQueryParam: "foo"
};
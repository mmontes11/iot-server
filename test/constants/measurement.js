export default {
    measurementRequestWithInvalidMeasurement: {
        measurement: {
            value: 10
        },
        device: {
            name: 'raspberry',
            geometry : {
                type : 'Point',
                coordinates : [
                    -8.4065665,
                    43.3682188
                ]
            }
        }
    },
    measurementRequestWithInvalidDevice: {
        measurement: {
            type: 'temperature',
            unit: {
                name: 'degrees',
                symbol: '°C'
            },
            value: 10
        },
        device: {
            geometry : {
                type : 'Point',
                coordinates : [
                    -8.4065665,
                    43.3682188
                ]
            }
        }
    },
    measurementRequestWithDeviceWithInvalidGeometry: {
        measurement: {
            type: 'temperature',
            unit: {
                name: 'degrees',
                symbol: '°C'
            },
            value: 10
        },
        device: {
            geometry : {
                coordinates : [
                    -8.4065665,
                    43.3682188
                ]
            }
        }
    },
    validMeasurementRequest: {
        measurement: {
            type: 'temperature',
            unit: {
                name: 'degrees',
                symbol: '°C'
            },
            value: 10
        },
        device: {
            name: 'raspberry',
            geometry : {
                type : 'Point',
                coordinates : [
                    -8.4065665,
                    43.3682188
                ]
            }
        }
    },
    temperatureMeasurement: {
        device: 'raspberry',
        type: 'temperature',
        unit: {
            name: 'degrees',
            symbol: '°C'
        },
        value: 10
    },
    temperatureMeasurement2: {
        device: 'raspberry',
        type: 'temperature',
        unit: {
            name: 'degrees',
            symbol: '°C'
        },
        value: 15
    },
    temperatureMeasurement3: {
        device: 'raspberry',
        type: 'arduino',
        unit: {
            name: 'degrees',
            symbol: '°C'
        },
        value: 15
    },
    humidityMeasurement: {
        device: 'raspberry',
        type: 'humidity',
        unit: {
            name: 'relative',
            symbol: '%'
        },
        value: 0.3
    },
    humidityMeasurement2: {
        device: 'raspberry',
        type: 'humidity',
        unit: {
            name: 'relative',
            symbol: '%'
        },
        value: 0.6
    },
    humidityMeasurement3: {
        device: 'arduino',
        type: 'humidity',
        unit: {
            name: 'relative',
            symbol: '%'
        },
        value: 0.6,
    }
};
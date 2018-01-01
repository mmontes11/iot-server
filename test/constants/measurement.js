export default {
    measurementRequestWithInvalidMeasurement: {
        measurement: {
            device: 'raspberry',
            value: 10
        },
        device: {
            name: 'raspberry',
            location: {
                longitude: -8.40,
                latitude: 43.37
            }
        }
    },
    measurementRequestWithInvalidDevice: {
        measurement: {
            device: 'raspberry',
            type: 'temperature',
            unit: {
                name: 'degrees',
                symbol: '°C'
            },
            value: 10
        },
        device: {
            location: {
                longitude: -8.40,
                latitude: 43.37
            }
        }
    },
    validMeasurementRequest: {
        measurement: {
            device: 'raspberry',
            type: 'temperature',
            unit: {
                name: 'degrees',
                symbol: '°C'
            },
            value: 10
        },
        device: {
            name: 'raspberry',
            location: {
                longitude: -8.40,
                latitude: 43.37
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
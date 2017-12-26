export default {
    validAuthHeader: 'Basic YWRtaW46YWRtaW4=',
    invalidAuthHeader: 'Whatever',
    validUser: {
        username: 'testUser',
        password: 'aA12345678&'
    },
    invalidUser: {
        password: 'aA12345678&'
    },
    userWithWeakPassword: {
        username: 'testUser',
        password: '1234'
    },
    doorOpenedEvent: {
        username: 'mmontes',
        device: 'raspberry',
        type: 'door_opened',
        duration: {
            unit: {
                name: 'seconds',
                symbol: 's'
            },
            value: 2.4
        }
    },
    doorClosedEvent: {
        username: 'mmontes',
        device: 'raspberry',
        type: 'door_closed',
        duration: {
            unit:  {
                name: 'seconds',
                symbol: 's'
            },
            value: 2.4
        }
    },
    doorClosedEvent2: {
        username: 'mmontes',
        device: 'arduino',
        type: 'door_closed',
        duration: {
            unit:  {
                name: 'seconds',
                symbol: 's'
            },
            value: 2.4
        }
    },
    windowOpenedEvent: {
        username: 'mmontes',
        device: 'raspberry',
        type: 'window_opened',
        duration: {
            unit:  {
                name: 'seconds',
                symbol: 's'
            },
            value: 2.4
        }
    },
    inValidEvent: {
        device: 'raspberry'
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
        unit:  {
            name: 'relative',
            symbol: '%'
        },
        value: 0.6
    },
    humidityMeasurement3: {
        device: 'arduino',
        type: 'humidity',
        unit:  {
            name: 'relative',
            symbol: '%'
        },
        value: 0.6
    },
    inValidMeasurement: {
        device: 'raspberry'
    },
    validMeasurementWithKind: {
        kind: 'measurement',
        device: 'raspberry',
        type: 'temperature',
        unit: {
            name: 'degrees',
            symbol: '°C'
        },
        value: 10
    },
    invalidMeasurementWithKind: {
        kind: 'measurement',
        device: 'raspberry',
        type: 'temperature',
        unit: {
            name: 'degrees',
            symbol: '°C'
        }
    },
    validMeasurementWithInvalidKind: {
        kind: 'foo',
        device: 'raspberry',
        type: 'temperature',
        unit: {
            name: 'degrees',
            symbol: '°C'
        },
        value: 10
    },
    validEventWithKind: {
        kind: 'event',
        username: 'mmontes',
        device: 'raspberry',
        type: 'window_opened',
        duration: {
            unit:  {
                name: 'seconds',
                symbol: 's'
            },
            value: 2.4
        }
    },
    invalidEventWithKind: {
        kind: 'event',
        username: 'mmontes',
        device: 'raspberry',
        duration: {
            unit:  {
                name: 'seconds',
                symbol: 's'
            },
            value: 2.4
        }
    },
    validEventWithInvalidKind: {
        kind: 'bar',
        username: 'mmontes',
        device: 'raspberry',
        type: 'window_opened',
        duration: {
            unit:  {
                name: 'seconds',
                symbol: 's'
            },
            value: 2.4
        }
    },
    deviceAtACoruna: {
        name: 'raspi-coruna',
        ip: '192.168.0.1',
        location : {
            geometry : {
                type : 'Point',
                coordinates : [
                    -8.4065665,
                    43.3682188
                ]
            },
            city : 'A Coruña',
            region : '58',
            country : 'ES'
        }
    },
    deviceAtACoruna2: {
        name: 'raspi-coruna2',
        ip: '192.168.0.1',
        location : {
            geometry : {
                type : 'Point',
                coordinates : [
                    -8.40,
                    43.38
                ]
            }
        }
    },
    deviceAtNYC: {
        name: 'raspi-nyc',
        ip: '192.168.0.1',
        location : {
            geometry : {
                type : 'Point',
                coordinates : [
                    -74.11,
                    40.697
                ]
            }
        }
    },
    deviceAtTokyo: {
        name: 'raspi-tokyo',
        ip: '192.168.0.1',
        location : {
            geometry : {
                type : 'Point',
                coordinates : [
                    139.57,
                    35.67
                ]
            }
        }
    }
};
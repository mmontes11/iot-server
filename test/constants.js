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
    inValidEventRequest: {
        event: {
            name: 'whatever'
        },
        device: {
            name: 'raspberry',
            location: {
                longitude: -8.40,
                latitude: 43.37
            }
        }
    },
    validEventRequest: {
        event : {
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
        device: {
            name: "raspberry",
            location: {
                "longitude": -8.40,
                "latitude": 43.37
            }
        }
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
            unit: {
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
            unit: {
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
            unit: {
                name: 'seconds',
                symbol: 's'
            },
            value: 2.4
        }
    },
    invalidMeasurementRequest: {
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
        geometry : {
            type : 'Point',
            coordinates : [
                -8.4065665,
                43.3682188
            ]
        }
    },
    deviceAtACoruna2: {
        name: 'raspi-coruna2',
        ip: '192.168.0.1',
        geometry : {
            type : 'Point',
            coordinates : [
                -8.40,
                43.38
            ]
        }
    },
    deviceAtNYC: {
        name: 'raspi-nyc',
        ip: '192.168.0.1',
        geometry : {
            type : 'Point',
            coordinates : [
                -74.25,
                40.69
            ]
        }
    },
    deviceAtTokyo: {
        name: 'raspi-tokyo',
        ip: '192.168.0.1',
        geometry : {
            type : 'Point',
            coordinates : [
                139.57,
                35.67
            ]
        }
    }
};
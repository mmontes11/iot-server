export default {
    eventRequestWithInvalidEvent: {
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
            name: 'raspberry'
        }
    },
    eventRequestWithInvalidDevice: {
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
                longitude: -8.40,
                latitude: 43.37
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
    }
};
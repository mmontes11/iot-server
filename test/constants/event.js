export default {
    eventRequestWithInvalidEvent: {
        event : {
            duration: {
                unit: {
                    name: 'seconds',
                    symbol: 's'
                },
                value: 2.4
            }
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
    eventRequestWithInvalidDevice: {
        event : {
            username: 'mmontes',
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
            geometry : {
                type : 'Point',
                coordinates : [
                    -8.4065665,
                    43.3682188
                ]
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
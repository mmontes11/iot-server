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
        thing: {
            name: 'raspberry',
            geometry : {
                type : 'Point',
                coordinates : [
                    -8.4065665,
                    43.3682188
                ]
            },
            topic: "home/room/raspberry/door",
            supportedObservationTypes: {
                measurement: [],
                event: ["door_opened"]
            }
        }
    },
    eventRequestWithInvalidThing: {
        event : {
            type: 'door_opened',
            duration: {
                unit: {
                    name: 'seconds',
                    symbol: 's'
                },
                value: 2.4
            }
        },
        thing: {
            name: 'raspberry'
        }
    },
    eventRequestWithThingWithInvalidGeometry: {
        event : {
            type: 'door_opened',
            duration: {
                unit: {
                    name: 'seconds',
                    symbol: 's'
                },
                value: 2.4
            }
        },
        thing: {
            name: 'raspberry',
            geometry : {
                coordinates : [
                    -8.4065665,
                    43.3682188
                ]
            },
            topic: "home/room/raspberry/door",
            supportedObservationTypes: {
                measurement: [],
                event: ["door_opened"]
            }
        }
    },
    validEventRequest: {
        event : {
            thing: 'raspberry',
            type: 'door_opened',
            duration: {
                unit: {
                    name: 'seconds',
                    symbol: 's'
                },
                value: 2.4
            }
        },
        thing: {
            name: "raspberry",
            geometry : {
                type : 'Point',
                coordinates : [
                    -8.4065665,
                    43.3682188
                ]
            },
            topic: "home/room/raspberry/door",
            supportedObservationTypes: {
                measurement: [],
                event: ["door_opened"]
            }
        }
    },
    doorOpenedEvent: {
        username: 'mmontes',
        thing: 'raspberry',
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
        thing: 'raspberry',
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
        thing: 'arduino',
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
        thing: 'raspberry',
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
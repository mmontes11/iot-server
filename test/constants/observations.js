export default {
    validDevice: {
        name: 'raspberry',
        geometry : {
            type : 'Point',
            coordinates : [
                -8.4065665,
                43.3682188
            ]
        }
    },
    invalidDevice:  {
        name: 'raspberry'
    },
    deviceWithInvalidGeometry:  {
        name: 'raspberry',
        geometry : {
            coordinates : [
                -8.4065665,
                43.3682188
            ]
        }
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
    }
};
export default {
    "validAuthHeader": "Basic YWRtaW46YWRtaW4=",
    "invalidAuthHeader": "Whatever",
    "validUser": {
        "userName": "testUser",
        "password": "aA12345678&"
    },
    "invalidUser": {
        "password": "aA12345678&"
    },
    "userWithWeakPassword": {
        "userName": "testUser",
        "password": "1234"
    },
    "validEvent": {
        "device": "raspberry",
        "relatedEntities": [
            {
                "name": "Martin's House",
                "type": "building",
                "geometry": {
                    "type": "Point",
                    "coordinates": [125.6, 10.1]
                }
            }
        ],
        "type": "door_opened",
        "duration": {
            "units": "s",
            "value": 2.4
        }
    },
    "validEvent2": {
        "device": "raspberry",
        "relatedEntities": [
            {
                "name": "Martin's House",
                "type": "building",
                "geometry": {
                    "type": "Point",
                    "coordinates": [125.6, 10.1]
                }
            }
        ],
        "type": "door_closed",
        "duration": {
            "units": "s",
            "value": 2.4
        }
    },
    "validEvent3": {
        "device": "raspberry",
        "relatedEntities": [
            {
                "name": "Martin's House",
                "type": "building",
                "geometry": {
                    "type": "Point",
                    "coordinates": [125.6, 10.1]
                }
            }
        ],
        "type": "window_opened",
        "duration": {
            "units": "s",
            "value": 2.4
        }
    },
    "inValidEvent": {
        "device": "raspberry",
        "relatedEntities": []
    }
}
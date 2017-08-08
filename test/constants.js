export default {
    "validAuthHeader": "Basic YWRtaW46YWRtaW4=",
    "invalidAuthHeader": "Whatever",
    "validUser": {
        "userName": "testUser",
        "password": "aA12345678&"
    },
    "invalidUserPayload": {
        "password": "aA12345678&"
    },
    "userWithWeakPassword": {
        "userName": "testUser",
        "password": "1234"
    },
    "validEvent": {
        "device": "raspberrri",
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
    }
}
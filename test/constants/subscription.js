export default {
    validSubscription: {
        type: "measurementChanged",
        chatId: 1234,
        thing: "raspi",
        observationType: "temperature"
    },
    validSubscription2: {
        type: "temperature",
        chatId: 5678,
        thing: "raspi",
        observationType: "temperature"
    },
    validSubscription3: {
        type: "event",
        chatId: 5678,
        thing: "raspi",
        observationType: "door-opened"
    },
    invalidSubscription: {
        type: "measurementChanged",
        thing: "raspi",
        observationType: "temperature"
    },
    validChatId: 1234,
    validChatId2: 5678,
    invalidChatId: "foo"
};
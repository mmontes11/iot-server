export default {
    validSubscription: {
        notificationType: "measurementChanged",
        chatId: 1234,
        thing: "raspi",
        observationType: "temperature"
    },
    validSubscription2: {
        notificationType: "temperature",
        chatId: 5678,
        thing: "raspi",
        observationType: "temperature"
    },
    validSubscription3: {
        notificationType: "event",
        chatId: 5678,
        thing: "raspi",
        observationType: "door-opened"
    },
    validChatId: 1234,
    validChatId2: 5678,
    invalidChatId: "foo",
    invalidSubscriptionId: 1,
    nonExistingSubscriptionId: "5a9a7c4be72f3003bc5e5798"
};
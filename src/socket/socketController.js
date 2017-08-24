import { logInfo } from '../utils/log';

class SocketController {
    constructor (io) {
        this.io = io
    }
    listen () {
        this.io.on("connection", (socket) => {
            logInfo(`Socket.io: New socket connection ${socket.id}`)
        })
    }
}

export { SocketController };
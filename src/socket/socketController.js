import logger from '../utils/logger';

class SocketController {
    constructor (io) {
        this.io = io
    }
    listen () {
        this.io.on("connection", (socket) => {
            logger.logInfo(`Socket.io: New socket connection ${socket.id}`)
        })
    }
}
export default SocketController;
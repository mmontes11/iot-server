class SocketController {
    constructor (io) {
        this.io = io
    }
    listen () {
        this.io.on("connection", socket => {
           console.log(`Socket.io: New socket connection ${socket.id}`)
        })
    }
}
export default SocketController;
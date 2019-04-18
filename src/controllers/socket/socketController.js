import { logInfo } from "../../utils/log";

export class SocketController {
  constructor(io) {
    this.io = io;
  }
  listen() {
    this.io.on("connection", socket => {
      logInfo("New connection");
      logInfo(`Thing: ${JSON.stringify(socket.thing)}`);
      socket.on("disconnect", () => {
        logInfo("New disconnection");
      });
    });
  }
  close() {
    logInfo("Socket server stopped");
    Object.keys(this.io.sockets.sockets).forEach(s => {
      this.io.sockets.sockets[s].disconnect(true);
    });
  }
}

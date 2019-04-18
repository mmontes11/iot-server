import SocketIOClient from "socket.io-client";
import { logInfo } from "../../utils/log";
import config from "../../config";

export class SocketController {
  constructor(io) {
    this.io = io;
  }
  listen() {
    this.io.on("connection", socket => {
      logInfo("New connection");
      const { token, thing } = socket;
      const thingSocket = new SocketIOClient(`http://${thing.ip}:${config.thingSocketPort}`, { query: { token } });
      thingSocket.on("data", data => {
        logInfo(`Receiving data from ${thing.name}:`);
        logInfo(JSON.stringify(data));
        socket.emit("data", data);
      });
      thingSocket.on("disconnect", () => {
        logInfo("Thing disconnection");
        socket.disconnect();
      });
      socket.on("disconnect", () => {
        logInfo("New disconnection");
        thingSocket.disconnect();
      });
    });
  }
  close() {
    logInfo("Socket server stopped");
    Object.keys(this.io.sockets.sockets).forEach(s => {
      this.io.sockets.sockets[s].disconnect();
    });
  }
}

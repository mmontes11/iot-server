import SocketIOClient from "socket.io-client";
import { logInfo, logError } from "../../utils/log";
import config from "../../config";

export class SocketController {
  constructor(io) {
    this.io = io;
  }
  static _getQueryParams(socket) {
    const { token, type } = socket;
    let query = { token };
    if (type) {
      query = {
        ...query,
        type,
      };
    }
    return query;
  }
  listen() {
    this.io.on("connection", socket => {
      logInfo("Socket connection");
      const { thing } = socket;
      const query = SocketController._getQueryParams(socket);
      const thingSocket = new SocketIOClient(`http://${thing.ip}:${config.thingSocketPort}`, { query });
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
        logInfo("Socket disconnection");
        thingSocket.disconnect();
      });
      thingSocket.on("connect_error", err => {
        logError(`Thing connection error: ${err}`);
        thingSocket.disconnect();
        socket.disconnect();
      });
      thingSocket.on("error", err => {
        logError(`Thing error: ${err}`);
        thingSocket.disconnect();
        socket.disconnect();
      });
      socket.on("error", err => {
        logError(`Socket error: ${err}`);
        thingSocket.disconnect();
        socket.disconnect();
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

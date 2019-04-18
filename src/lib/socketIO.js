import SocketIO from "socket.io";
import jwt from "jsonwebtoken";
import config from "../config";
import { logError } from "../utils/log";

export const setupSocketIO = server => {
  const io = new SocketIO(server);
  io.use((socket, next) => {
    const {
      handshake: {
        query: { token },
      },
    } = socket;
    try {
      if (jwt.verify(token, config.jwtSecret)) {
        return next();
      }
      const authError = new Error("Auth error");
      logError(logError);
      return next(authError);
    } catch (err) {
      logError(err);
      return next(err);
    }
  });
  return io;
};

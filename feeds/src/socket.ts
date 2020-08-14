let io: any;

export const socketio = {
  init: (httpServer: any) => {
      io = require("socket.io")(httpServer);
      return io;
  },
    getIO: () => {
      if(!io) {
          throw new Error('Socket.io no initialized!')
      }
      return io;
    }
};
import { Server } from "socket.io";
import ACTIONS from "./ACTIONS.js";

const serverSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Store user mappings and cumulative code
  const userSocketMap = {};

  // return all the users in the room
  function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
      (socketId) => {
        return {
          socketId,
          username: userSocketMap[socketId],
        };
      }
    );
  }

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Listen for clients actions
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
      // Check if the user is already in the list
      const existingClient = getAllConnectedClients(roomId).find(
        (client) => client.username === username
      );

      // If the user is already in the list, you can handle it appropriately
      if (!existingClient) {
        // store user with uniq socket id
        userSocketMap[socket.id] = username;

        // join the user in room
        socket.join(roomId);

        // get list of al the clients in Room
        const clients = getAllConnectedClients(roomId);
        console.log(clients);

        // send all the user details back to client
        clients.forEach(({ socketId }) => {
          io.to(socketId).emit(ACTIONS.JOINED, {
            clients,
            username,
            socketId: socket.id,
          });
        });
      }
    });

    // Listening for code change from client
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
      // sending code changes to other clients
      socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    // sync code with newly joined user
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
      // sending code changes to other clients
      io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    // get all the rooms created by every user
    socket.on("disconnecting", () => {
      const rooms = [...socket.rooms];

      rooms.forEach((roomId) => {
        socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
          socketId: socket.id,
          username: userSocketMap[socket.id],
        });
      });

      // remove the user from server
      delete userSocketMap[socket.id];

      socket.leave();
    });
  });
};

export default serverSocket;

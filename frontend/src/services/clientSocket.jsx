import { io } from "socket.io-client";

const options = {
    closeOnBeforeunload: false,
    autoConnect: false,
    forceNew: true,
    reconnection: true,
    reconnectionAttempts: 5,
    timeout: 10000,
    transports: ["websocket"],
};

export const clientSocket = io(import.meta.env.VITE_BACKEND_URL, options);
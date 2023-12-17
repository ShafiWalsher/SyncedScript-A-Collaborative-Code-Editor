import express from "express";
import httpServer from "http";
import serverSocket from "./serverSocket.js";
import cors from "cors";

const app = express();
const http = httpServer.createServer(app);

// middleware
app.use(cors());

// const io = serverSocket(http);
serverSocket(http);

const PORT = process.env.PORT || 8000;
http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

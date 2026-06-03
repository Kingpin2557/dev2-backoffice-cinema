import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import apiRouter from "./routes";

const app = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
});

app.use(express.json());
app.use("/api", apiRouter);

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

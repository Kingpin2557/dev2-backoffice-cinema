import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import apiRouter from "./routes";

const app = express();
const httpServer = createServer(app);
const PORT: number = parseInt(<string>process.env.PORT, 10) || 3000;

export const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
});

app.use(express.json());
app.use("/api", apiRouter);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

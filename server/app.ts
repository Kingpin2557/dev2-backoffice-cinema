import "dotenv/config";
import cors from "cors";
import express, { Application } from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import routes from "./routes";

import { createServer, Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

const app: Application = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;
const isProduction: boolean = process.env.NODE_ENV === "production";

const httpServer: HttpServer = createServer(app);

let io: SocketIOServer | undefined;

if (!isProduction) {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: `http://localhost:${PORT}`,
      credentials: true,
    },
  });

  app.set("io", io);

  io.on("connection", (socket) => {
    console.log(`User connected to real-time sync: ${socket.id}`);
  });
}

app.use(
  cors({
    origin: [
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:${PORT}`,
    ],
    credentials: true,
  }),
);

app.use((req, res, next) => {
  res.locals.path = req.path;
  res.locals.isProduction = isProduction;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);

if (!isProduction) {
  httpServer.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

export default app;

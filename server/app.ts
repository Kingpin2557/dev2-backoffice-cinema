import "dotenv/config";
import cors from "cors";
import express, { Application, Request, Response, NextFunction } from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import fs from "fs";
import routes from "./routes";

import { createServer, Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

const app: Application = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;
const isProduction: boolean = process.env.NODE_ENV === "production";

const httpServer: HttpServer = createServer(app);

// ==========================================
// 1. CORS CONFIGURATION
// ==========================================
const allowedOrigins = isProduction
  ? ([
      "https://zitplaatsreservatie-kiosk-kingpin25.vercel.app",
      process.env.CORS_ORIGIN?.replace(/\/$/, ""),
    ].filter(Boolean) as string[])
  : [`http://localhost:${PORT}`, "http://localhost:5173"];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));

// ==========================================
// 2. SOCKET.IO REAL-TIME ROUTER SYNC
// ==========================================
let io: SocketIOServer | undefined;

if (!isProduction) {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  app.set("io", io);

  io.on("connection", (socket) => {
    console.log(`User connected to real-time sync: ${socket.id}`);
  });
}

// ==========================================
// 3. MIDDLEWARES & BODY PARSERS
// ==========================================
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.path = req.path;
  res.locals.isProduction = isProduction;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 4. VIEW ENGINE & DYNAMIC STATIC ASSETS
// ==========================================
app.set("view engine", "ejs");

const viewsPath = isProduction
  ? path.join(process.cwd(), "views")
  : path.join(process.cwd(), "server", "views");
app.set("views", viewsPath);

app.use(expressLayouts);
app.set("layout", "layouts/main");

// Look for public directory in root, fall back to server/public if nested
const publicPath = fs.existsSync(path.join(process.cwd(), "public"))
  ? path.join(process.cwd(), "public")
  : path.join(process.cwd(), "server", "public");

app.use(express.static(publicPath));

// ==========================================
// 5. ROUTE ATTACHMENTS
// ==========================================
app.use("/", routes);

// ==========================================
// 6. SERVER LIFECYCLE EXECUTION
// ==========================================
if (!isProduction) {
  httpServer.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

export default app;

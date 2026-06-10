import "dotenv/config";
import cors from "cors";
import express, { Application, Request, Response, NextFunction } from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import routes from "./routes";

import { createServer, Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

const app: Application = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;
const isProduction: boolean = process.env.NODE_ENV === "production";

const httpServer: HttpServer = createServer(app);

// ==========================================
// 1. CORS CONFIGURATION (MUST BE FIRST)
// ==========================================
const allowedOrigins = [
  "https://zitplaatsreservatie-kiosk-kingpin25.vercel.app",
  process.env.CORS_ORIGIN?.replace(/\/$/, ""),
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`
    : null,
  `http://localhost:${PORT}`,
  "http://localhost:5173",
].filter(Boolean) as string[];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Handle HTTP preflight OPTIONS requests explicitly before routing matches
app.options(
  "*",
  cors(corsOptions) as unknown as (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void,
);

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
// 4. VIEW ENGINE & STATIC CONTENT CONFIGS
// ==========================================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(express.static(path.join(__dirname, "public")));

// ==========================================
// 5. ROUTE ATTACHMENTS (MUST BE AFTER CORS)
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

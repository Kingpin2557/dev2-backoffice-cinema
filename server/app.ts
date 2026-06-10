import "dotenv/config";
import cors from "cors";
import express, { Application, Request, Response, NextFunction } from "express";
import expressLayouts from "express-ejs-layouts";
import path from "path";
import routes from "./routes";

const app: Application = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;
const isProduction: boolean = process.env.NODE_ENV === "production";

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
// 2. MIDDLEWARES & BODY PARSERS
// ==========================================
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.path = req.path;
  res.locals.isProduction = isProduction;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 3. VIEW ENGINE & ABSOLUTE STATIC CONTENT CONFIGS
// ==========================================
app.set("view engine", "ejs");
// Using process.cwd() guarantees accurate directory calculation inside Vercel containers
app.set("views", path.join(process.cwd(), "server", "views"));

app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(express.static(path.join(process.cwd(), "public")));

// ==========================================
// 4. ROUTE ATTACHMENTS
// ==========================================
app.use("/", routes);

// ==========================================
// 5. LOCAL ENVIRONMENT ONLY (SOCKET.IO & LISTEN)
// ==========================================
if (!isProduction) {
  // We dynamically load these modules locally so they never execute/crash on production Vercel servers
  import("http").then(({ createServer }) => {
    import("socket.io").then(({ Server: SocketIOServer }) => {
      const httpServer = createServer(app);
      const io = new SocketIOServer(httpServer, {
        cors: {
          origin: allowedOrigins,
          credentials: true,
        },
      });

      app.set("io", io);

      io.on("connection", (socket) => {
        console.log(`User connected to real-time sync: ${socket.id}`);
      });

      httpServer.listen(PORT, () => {
        console.log(`Development Server running at http://localhost:${PORT}`);
      });
    });
  });
}

// Export the application raw for Vercel's serverless pipeline handler
export default app;

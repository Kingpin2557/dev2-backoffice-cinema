import express from "express";
import pageRouter from "./routes/pages";
import apiRouter from "./routes/api";

const router = express.Router();

router.use("/", pageRouter);
router.use("/api", apiRouter);

export default router;

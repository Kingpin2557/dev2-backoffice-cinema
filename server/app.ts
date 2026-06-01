import express, { Application } from "express";
import routes from "./routes";

const app: Application = express();
const PORT: number = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}/api/movies`);
});

import express from "express";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(
  cors({
    origin: ["*", "http://localhost:3344", "http://localhost:3000"],
  })
);
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", routes);

export default app;

import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
/* ROUTE IMPORTS */
import milestoneRoutes from "./routes/milestoneRoutes";
import partRoutes from "./routes/partRoutes";
import programRoutes from "./routes/programRoutes";
import searchRoutes from "./routes/searchRoutes";
import teamRoutes from "./routes/teamRoutes";
import userRoutes from "./routes/userRoutes";
import workItemRoutes from "./routes/workItemRoutes";


/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.get("/", (req, res) => {
  res.send("This is home route");
});

app.use("/milestones", milestoneRoutes);
app.use("/partNumbers", partRoutes);
app.use("/programs", programRoutes);
app.use("/search", searchRoutes);
app.use("/teams", teamRoutes);
app.use("/users", userRoutes);
app.use("/workItems", workItemRoutes);

/* 404 HANDLER (must come after routes) */
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

/* ERROR HANDLING MIDDLEWARE (must come last) */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

/* SERVER */
const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});

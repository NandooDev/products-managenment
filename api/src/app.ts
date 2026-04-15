import cors from "cors";
import express from "express";
import helmet from "helmet";

import { errorHandler } from "./middlewares/error-handler";
import { notFound } from "./middlewares/not-found";
import { routes } from "./routes";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use(routes);

app.use(notFound);
app.use(errorHandler);

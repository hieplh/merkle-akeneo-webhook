import { PrismaClient } from "@prisma/client";
import cors from "cors";
import * as dotenv from "dotenv";
import express, { Express, NextFunction, Response } from "express";
import path from "path";
import { AuthenticatedRequest } from "../@types/request/authentication";
import { logger } from "./logging/logger";
import { routes } from "./routes";
require("express-async-errors");

const prisma = new PrismaClient();
prisma.$connect();

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "resources")));
app.routes = routes(app, prisma, logger);

dotenv.config();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

app.use((err: Error, req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  logger.error("Error | Global | ", err);

  if (!res.headersSent) {
    res.status(500).json({
      error: {
        statusCode: 500,
        message: err.message,
      },
    });
  }

  next(err);
});

app.use("*", (req: AuthenticatedRequest, res: Response) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

process.on("unhandledRejection", (err) => {
  console.log("An error unhandledRejection: ", err);
});

process.on("uncaughtException", (err) => {
  console.log("An error uncaughtException: ", err);
});

process.on("rejectionHandled", (err) => {
  console.log("rejectionHandled: ", err);
});
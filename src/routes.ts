import { PrismaClient } from "@prisma/client";
import { webhook } from "./akeneo/webhook";
import { Express } from "express";
import { Logger } from "winston";

export const routes = (app: Express, db: PrismaClient, logger: Logger) => {
  webhook(app, db, logger);
};

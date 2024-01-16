import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: { [key: string]: any };
}
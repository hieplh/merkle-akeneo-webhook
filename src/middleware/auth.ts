import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../@types/request/authentication";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY ?? "";

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authorization = req["headers"].authorization ?? "";
  let error = {} as any;

  if (authorization) {
    const token = authorization.substring(7);
    jwt.verify(token, secretKey, (err: any, user: any) => {
      if (err) {
        error = {
          status_code: 403,
          message: "Forbidden",
        };
        return err;
      }

      req.user = { user: user };
    });
  } else {
    error = {
      status_code: 401,
      message: "Unauthorized",
    };
  }

  if (Object.keys(error).length !== 0) {
    return res.status(error.status_code).json({ message: error.message });
  }

  return next();
};

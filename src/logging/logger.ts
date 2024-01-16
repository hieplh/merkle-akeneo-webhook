import * as fs from "fs";
import * as winston from "winston";

// check if directory exist
if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs"); // create new directory
}

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: format,
    }),
    new winston.transports.File({
      filename: "logs/info.log",
      level: "info",
      format: format,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: format,
    })
  );
}

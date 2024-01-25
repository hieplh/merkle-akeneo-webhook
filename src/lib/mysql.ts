import * as mysql2 from "mysql2-async";

export class Db {
  private static instance: mysql2.default;

  private constructor() {}

  public static getInstance(): mysql2.default {
    if (!Db.instance) {
      Db.instance = new mysql2.default({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE_NAME,
        charset: process.env.DATABASE_CHARSET,
        ssl: {
          rejectUnauthorized: true,
        },
      });
    }

    return Db.instance;
  }
}

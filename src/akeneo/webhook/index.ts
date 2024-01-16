import { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Logger } from "winston";

async function create(req: Request, db: PrismaClient) {
  const event = req.body;
  await db.events.create({
    data: {
      content: JSON.stringify(event),
      event_details: {
        create: event.events.map((e: any) => {
          return { content: JSON.stringify(e) };
        }),
      },
    },
  });
}

export const webhook = (app: Express, db: PrismaClient, logger: Logger) => {
  app.post("/", (req: Request, res: Response) => {
    console.log("body", req.body["events"]);

    create(req, db);
    res.sendStatus(200);
  });

  app.get("/:pretty?", (req: Request, res: Response) => {
    const isPretty = req.params.pretty ? req.params.pretty === 'pretty' : false;

    db.events
      .findMany({
        orderBy: {
          id: "desc",
        },
      })
      .then((data: any) => {
        data.forEach((e: any) => {
            e.content = JSON.parse(e.content);
        });
        return data;
      })
      .then((data: any) => {
        res.header("Content-Type",'application/json');
        res.send(isPretty ? JSON.stringify(data, null, 2) : data);
      })
      .catch((e) => {
        throw e;
      });
  });
};

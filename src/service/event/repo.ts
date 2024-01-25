import { Db } from "@/lib/mysql";

export async function countAllEvents() {
  return await Db.getInstance().getval("SELECT COUNT(*) as count FROM events");
}

export async function fetchAllEvents(page: number | null, count: number) {
  const result = await Db.getInstance().getall(
    "SELECT * FROM events ORDER BY id DESC LIMIT ? OFFSET ?",
    [count, ((page !== null && page > 0 ? page : 1) - 1) * count]
  );
  parseStringify(result);
  return result;
}

export async function fetchEvent(id: number) {
  const result = await Db.getInstance().getrow(
    "SELECT * FROM events WHERE id = ?",
    [id]
  );
  parseStringify(result);
  return result;
}

export async function createEvent(data: any) {
  Db.getInstance()
    .query("INSERT INTO events (content) VALUES (?)", [JSON.stringify(data)])
    .then((res: any) => {
      if (!res) {
        throw res;
      }

      data.events.forEach((e: any) => {
        Db.getInstance().query(
          "INSERT INTO event_details (event_id, content) VALUES (?, ?)",
          [res.insertId, JSON.stringify(e)]
        );
      });
    });
}

function parseStringify(data: any) {
  if (Array.isArray(data)) {
    data.forEach((e: any) => {
      e.content = JSON.parse(e.content);
    });
  } else {
    data.content = JSON.parse(data.content);
  }
}

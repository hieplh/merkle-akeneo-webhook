import connection from "@/lib/mysql";

export async function countAllEvents() {
  return connection.promise().query("SELECT COUNT(*) as count FROM events");
}

export async function fetchAllEvents(page: number | null, count: number) {
  return connection
    .promise()
    .execute("SELECT * FROM events ORDER BY id DESC LIMIT ? OFFSET ?", [
      count,
      ((page !== null && page > 0 ? page : 1) - 1) * count,
    ])
    .then(([rows, fields]) => {
      (rows as any).forEach((e: any) => {
        e.content = JSON.parse(e.content);
      });
      return [rows, fields];
    });
}

export async function fetchEvent(id: number) {
  return connection.promise().query("SELECT * FROM events WHERE id = ?", [id]);
}

export async function createEvent(data: any) {
  return connection.query(
    "INSERT INTO events (content) VALUES (?)",
    [JSON.stringify(data)],
    (err, res: any) => {
      if (err) {
        throw err;
      }

      data.events.forEach((e: any) => {
        connection.query(
          "INSERT INTO event_details (event_id, content) VALUES (?, ?)",
          [res.insertId, JSON.stringify(e)]
        );
      });
      return;
    }
  );
}

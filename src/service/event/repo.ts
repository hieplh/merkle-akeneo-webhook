import prisma from "@/lib/prisma";

export async function countAllEvents() {
  return await prisma.events.count();
}

export async function fetchAllEvents(
  cursor: number | null,
  page: number | null,
  count: number,
  skip: number
) {
  var cursorAndSkip = {};
  if (cursor !== null) {
    cursorAndSkip = {
      skip: skip,
      cursor: {
        id: cursor,
      },
    };
  } else if (page !== null) {
    cursorAndSkip = {
      skip: ((page > 0 ? page : 1) - 1) * count,
    };
  }

  return await prisma.events
    .findMany({
      ...{
        take: count,
        orderBy: {
          id: "desc",
        },
      },
      ...cursorAndSkip,
    })
    .then((data: any) => {
      data.forEach((e: any) => {
        e.content = JSON.parse(e.content);
      });
      return data;
    })
    .catch((e: any) => {
      throw e;
    });
}

export async function fetchEvent(id: number) {
  return await prisma.events
    .findFirst({
      where: {
        id: id,
      },
    })
    .then((data: any) => {
      data.content = JSON.parse(data.content);
      return data;
    })
    .catch((e: any) => {
      throw e;
    });
}

export async function createEvent(data: any) {
  await prisma.events.create({
    data: {
      content: JSON.stringify(data),
      event_details: {
        create: data.events.map((e: any) => {
          return { content: JSON.stringify(e) };
        }),
      },
    },
  });
}

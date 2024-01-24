import paginationConfig from "@/config/pagination";
import { errorContent, errorHeaders } from "@/lib/error-handle";
import {
  countAllEvents,
  createEvent,
  fetchAllEvents,
} from "@/service/event/repo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const page =
      params.get("page") !== null ? Number(params.get("page")) : null;

    const [totalCount] = await countAllEvents();
    const [events] = await fetchAllEvents(
      page,
      paginationConfig.count,
    );
    return NextResponse.json(
      {
        totalCount: (totalCount as any)[0].count,
        events: events,
      },
      {
        headers: { "Content-Type": "text/plain" },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      errorContent(error.name, error.message),
      errorHeaders()
    );
  }
}

export async function POST(request: NextRequest) {
  request
    .json()
    .then((data: any) => {
      createEvent(data);
    })
    .catch((error: any) =>
      NextResponse.json(errorContent(error.name, error.message), errorHeaders())
    );

  return NextResponse.json({});
}

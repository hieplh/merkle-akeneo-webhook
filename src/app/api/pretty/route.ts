import paginationConfig from "@/config/pagination";
import { errorContent, errorHeaders } from "@/lib/error-handle";
import { countAllEvents, fetchAllEvents } from "@/service/event/repo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const page =
      params.get("page") !== null ? Number(params.get("page")) : null;

    const totalCount = await countAllEvents();
    const events = await fetchAllEvents(page, paginationConfig.count);
    return NextResponse.json(
      {
        totalCount: totalCount,
        events: events,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      errorContent(error.name, error.message),
      errorHeaders()
    );
  }
}

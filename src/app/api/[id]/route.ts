import { errorContent, errorHeaders } from "@/lib/error-handle";
import { fetchEvent } from "@/service/event/repo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const params = pathname.substring(5);

  const id = Number(params);

  try {
    const events = await fetchEvent(id);
    return NextResponse.json(events, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error: any) {
    return NextResponse.json(
      errorContent(error.name, error.message),
      errorHeaders()
    );
  }
}
import { errorContent, errorHeaders } from "@/lib/error-handle";
import { countAllEvents } from "@/service/event/repo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const totalCount = await countAllEvents();
    return NextResponse.json(
      {
        name: "events",
        total: totalCount,
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

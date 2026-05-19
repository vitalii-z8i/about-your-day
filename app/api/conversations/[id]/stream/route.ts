import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { container } from "@/src/infrastructure/composition/container";
import NoRecordError from "@/src/application/errors/noRecord";
import { ExternalError } from "@/src/application/errors";
import ERROR_CODES from "@/lib/errorCodes";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const stream = await container.actions.conversation
      .respondToMessage()
      .call(id);
    return new Response(stream as unknown as ReadableStream<Uint8Array>, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    if (err instanceof NoRecordError) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: ERROR_CODES[err.code] || 500 },
      );
    }
    if (err instanceof ExternalError) {
      return NextResponse.json(
        { error: err.message },
        { status: ERROR_CODES[err.code] || 500 },
      );
    }

    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

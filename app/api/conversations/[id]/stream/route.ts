import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { container } from "@/src/infrastructure/composition/container";
import NoRecordError from "@/src/application/errors/noRecord";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const conversation = await container.conversation.find().execute(id);
    const stream = await container.conversation.respondToMessage().execute(conversation);
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
        { status: 404 }
      );
    }
    console.error(err);
    return NextResponse.json({ error: "Stream failed" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { container } from "@/src/infrastructure/composition/container";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversations = await container.conversation.list().execute(user.id);
  return NextResponse.json(conversations);
}

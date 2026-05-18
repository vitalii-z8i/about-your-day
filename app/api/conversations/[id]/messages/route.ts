import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { container } from "@/src/infrastructure/composition/container";
import AuthError from "@/src/application/errors/auth";
import ValidationError from "@/src/presentation/errors/validation";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const conversation = await container.actions.conversation
      .newMessage()
      .call(token, id, body.message);
    return NextResponse.json(conversation);
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ errors: err.details }, { status: 400 });
    }
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    console.error(err);
    return NextResponse.json(
      { error: "Failed to add message" },
      { status: 500 },
    );
  }
}

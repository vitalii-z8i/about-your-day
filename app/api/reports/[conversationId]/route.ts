import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { container } from "@/src/infrastructure/composition/container";
import NoRecordError from "@/src/application/errors/noRecord";
import AuthError from "@/src/application/errors/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId } = await params;

  try {
    const report = await container.actions.report
      .getReport()
      .call(token, conversationId);
    return NextResponse.json(report);
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    if (err instanceof NoRecordError) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId } = await params;

  try {
    await container.actions.report.syncReport().call(token, conversationId);
    return NextResponse.json({});
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    if (err instanceof NoRecordError) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

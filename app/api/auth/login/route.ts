import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { container } from "@/src/infrastructure/composition/container";
import { MockTokenService } from "@/src/infrastructure/services/mock/token";
import AuthError from "@/src/application/errors/auth";
import ValidationError from "@/src/presentation/errors/validation";

const tokenService = new MockTokenService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const token = await container.actions.auth.login().call(body);
    const user = await tokenService.verify(token);

    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ user });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ errors: err.details }, { status: 400 });
    }
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    console.error(err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

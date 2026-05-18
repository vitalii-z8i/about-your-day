import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { container } from "@/src/infrastructure/composition/container";
import { MockTokenService } from "@/src/infrastructure/services/mock/token";
import AuthError from "@/src/application/errors/auth";

const tokenService = new MockTokenService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const token = await container.user.login().execute({ email, password });
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
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    console.error(err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

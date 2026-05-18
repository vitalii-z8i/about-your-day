import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { container } from "@/src/infrastructure/composition/container";
import AuthError from "@/src/application/errors/auth";
import ValidationError from "@/src/presentation/errors/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const user = await container.actions.auth.register().call(body);
    const token = await container.user.login().execute({
      email: body.email as string,
      password: body.password as string,
    });

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
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}

import { SignJWT, jwtVerify } from "jose";
import type { ITokenService } from "@/src/application/ports/services/ITokenService";
import type { JwtUser } from "@/src/application/use-cases/user/user.types";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback-dev-secret"
);

export class MockTokenService implements ITokenService {
  async issue(payload: JwtUser): Promise<string> {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .setIssuedAt()
      .sign(secret);
  }

  async verify(token: string): Promise<JwtUser> {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
    };
  }
}

import { cookies } from "next/headers";
import { MockTokenService } from "@/src/infrastructure/services/mock/token";
import type { JwtUser } from "@/src/application/use-cases/user/user.types";

const tokenService = new MockTokenService();

export async function getCurrentUser(): Promise<JwtUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return null;
    return await tokenService.verify(token);
  } catch {
    return null;
  }
}

import type { JwtUser } from "@/src/application/use-cases/user/user.types";

export interface ITokenService {
  issue(payload: JwtUser): Promise<string>;
  verify(token: string): Promise<JwtUser>;
}

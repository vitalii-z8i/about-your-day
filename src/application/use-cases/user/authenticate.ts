import { AuthError } from "../../errors";
import type { IUserRepository } from "@/src/application/ports/data-access";
import type { ITokenService } from "@/src/application/ports/services";
import { JwtUser } from "./user.types";

export default class AuthenticateUser {
  constructor(
    protected tokenService: ITokenService,
    protected userRepository: IUserRepository,
  ) {}

  async execute(token: string) {
    const userPayload: JwtUser = await this.tokenService.verify(token);
    const confirmUser = await this.userRepository.exists({
      id: userPayload.id,
      email: userPayload.email,
    });
    if (!confirmUser) {
      throw new AuthError("You are not authorized");
    }

    return userPayload;
  }
}

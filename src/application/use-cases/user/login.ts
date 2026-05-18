import { AuthError } from "../../errors";
import type { IUserRepository } from "@/src/application/ports/data-access";
import type {
  IEncryptionService,
  ITokenService,
} from "@/src/application/ports/services";
import { LoginUserDTO } from "./user.types";

export default class LoginUser {
  constructor(
    protected repo: IUserRepository,
    protected encryptionService: IEncryptionService,
    protected tokenService: ITokenService,
  ) {}

  async execute({ email, password }: LoginUserDTO): Promise<string> {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new AuthError("Invalid email or pass");
    const isPasswordValid = await this.encryptionService.compare(
      password,
      user.encryptedPassword,
    );
    if (!isPasswordValid) throw new AuthError("Invalid email or password");

    const token: string = await this.tokenService.issue({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return token;
  }
}

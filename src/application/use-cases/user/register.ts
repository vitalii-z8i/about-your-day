import { User } from "@/src/domain/entities";
import { AuthError } from "../../errors";
import type { IUserRepository } from "@/src/application/ports/data-access";
import type { IEncryptionService } from "@/src/application/ports/services";
import { UserDTO } from "./user.types";

export default class RegisterUser {
  constructor(
    protected repo: IUserRepository,
    protected encryptionService: IEncryptionService,
  ) {}

  async execute({ password, ...userData }: UserDTO): Promise<User> {
    const emailExists = await this.repo.exists({ email: userData.email });
    if (emailExists) {
      throw new AuthError("A user with this email already exists");
    }

    const encryptedPassword: string =
      await this.encryptionService.encrypt(password);

    const user: User = await this.repo.create({
      ...userData,
      encryptedPassword,
    });

    return user;
  }
}

import { AuthUser, User } from "@/src/domain/entities";

export interface IUserRepository {
  exists(query: { id?: string; email?: string }): Promise<boolean>;
  create(data: Omit<AuthUser, "id">): Promise<User>;
  findByEmail(email: string): Promise<AuthUser>;
}

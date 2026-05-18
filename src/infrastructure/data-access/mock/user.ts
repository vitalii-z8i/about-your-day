import type { AuthUser, User } from "@/src/domain/entities";
import type { IUserRepository } from "@/src/application/ports/data-access/IUserRepository";
import db from "@/lib/mock-db";
import AuthError from "@/src/application/errors/auth";

export class MockUserRepository implements IUserRepository {
  async exists(query: { id?: string; email?: string }): Promise<boolean> {
    return db.users.some(
      (u) =>
        (query.id !== undefined && u.id === query.id) ||
        (query.email !== undefined && u.email === query.email)
    );
  }

  async create(data: Omit<AuthUser, "id">): Promise<User> {
    const user: AuthUser = {
      id: crypto.randomUUID(),
      ...data,
    };
    db.users.push(user);
    return { id: user.id, name: user.name, email: user.email };
  }

  async findByEmail(email: string): Promise<AuthUser> {
    const user = db.users.find((u) => u.email === email);
    if (!user) throw new AuthError("Invalid credentials");
    return user;
  }
}

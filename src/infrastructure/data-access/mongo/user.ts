import type { AuthUser, User } from "@/src/domain/entities";
import type { IUserRepository } from "@/src/application/ports/data-access/IUserRepository";
import AuthError from "@/src/application/errors/auth";
import client from "./client";

type UserDocument = {
  _id: string;
  name: string;
  email: string;
  encryptedPassword: string;
};

function toAuthUser(doc: UserDocument): AuthUser {
  const { _id, ...rest } = doc;
  return { id: _id, ...rest };
}

function toUser(doc: UserDocument): User {
  return { id: doc._id, name: doc.name, email: doc.email };
}

export class MongoUserRepository implements IUserRepository {
  private get collection() {
    return client.db().collection<UserDocument>("users");
  }

  async exists(query: { id?: string; email?: string }): Promise<boolean> {
    const filter: Record<string, unknown> = {};
    if (query.id !== undefined && query.email !== undefined) {
      filter._id = query.id;
      filter.email = query.email;
    } else if (query.id !== undefined) {
      filter._id = query.id;
    } else if (query.email !== undefined) {
      filter.email = query.email;
    }
    const doc = await this.collection.findOne(filter, { projection: { _id: 1 } });
    return doc !== null;
  }

  async create(data: Omit<AuthUser, "id">): Promise<User> {
    const id = crypto.randomUUID();
    const doc: UserDocument = { _id: id, ...data };
    await this.collection.insertOne(doc);
    return toUser(doc);
  }

  async findByEmail(email: string): Promise<AuthUser> {
    const doc = await this.collection.findOne({ email });
    if (!doc) throw new AuthError("Invalid credentials");
    return toAuthUser(doc);
  }
}

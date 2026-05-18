import type { AuthUser } from "@/src/domain/entities";
import type { Conversation } from "@/src/domain/entities";

type MockDB = {
  users: AuthUser[];
  conversations: Conversation[];
};

const db: MockDB = { users: [], conversations: [] };

export default db;

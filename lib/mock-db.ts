import type { AuthUser } from "@/src/domain/entities";
import type { Conversation } from "@/src/domain/entities";

type MockDB = {
  users: AuthUser[];
  conversations: Conversation[];
};

declare global {
  // eslint-disable-next-line no-var
  var __mockDb: MockDB | undefined;
}

const db: MockDB =
  globalThis.__mockDb ??
  (globalThis.__mockDb = { users: [], conversations: [] });

export default db;

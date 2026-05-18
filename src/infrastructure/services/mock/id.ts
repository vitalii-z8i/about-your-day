import { randomUUID } from "crypto";
import type { IIdService } from "@/src/application/ports/services/IIdService";

export class MockIdService implements IIdService {
  generateId(): string {
    return randomUUID();
  }
}

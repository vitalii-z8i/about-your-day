import { createHash } from "crypto";
import type { IEncryptionService } from "@/src/application/ports/services/IEncryptionService";

// SHA-256 mock — not suitable for production (use bcrypt in real impl)
export class MockEncryptionService implements IEncryptionService {
  async encrypt(plain: string): Promise<string> {
    return createHash("sha256").update(plain).digest("hex");
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return (await this.encrypt(plain)) === hashed;
  }
}

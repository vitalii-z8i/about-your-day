export interface IEncryptionService {
  encrypt(plain: string): Promise<string>;
  compare(plain: string, hashed: string): Promise<boolean>;
}

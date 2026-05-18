export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthUser = User & {
  encryptedPassword: string;
};

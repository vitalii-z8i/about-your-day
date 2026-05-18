import { User } from "@/src/domain/entities";

export type UserDTO = Pick<User, "name" | "email"> & { password: string };

export type LoginUserDTO = {
  email: string;
  password: string;
};

export type JwtUser = Pick<User, "id" | "name" | "email">;

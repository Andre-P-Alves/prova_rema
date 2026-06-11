// Amplia os tipos padrão do NextAuth com os campos id, role e setor do usuário REMA.
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "USER";
      setor: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "ADMIN" | "USER";
    setor?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "USER";
    setor: string;
  }
}

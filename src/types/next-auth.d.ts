import { DefaultSession } from "next-auth";

declare module "next-auth" {
    export type Session = {
        user: {
            id: string,
            name: string
        } & DefaultSession['user'];
    };
}

declare module "next-auth/jwt" {
    interface JWT {
        name?: string,
        username?: string,
        id?: string,
    }
}

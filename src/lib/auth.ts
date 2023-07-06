import { NextAuthOptions } from "next-auth";
import { authenticateUser } from "../utils/dbUtils";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: "/login",
        
    },
    session: {
        strategy: "jwt",
    },
    providers : [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            credentials: {
                username: { type: "text"},
                password: { type: "password"}
            }, 
            async authorize(credentials) {
                console.log("Credentials: ", credentials)
                let userFromDb = await authenticateUser(credentials?.username!, credentials?.password!)
                if (!credentials?.username || !credentials.password) {
                    throw new Error("Invalid credentials")
                }
                
                let returnUser = userFromDb ? {
                    id : userFromDb.id,
                    username: userFromDb.username,
                    bio: userFromDb.bio,
                    name: userFromDb.name,
                    profilePic: userFromDb.profilePic
                } : null

                return returnUser
            },
        })
    ],
}

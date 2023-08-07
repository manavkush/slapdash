import { NextAuthOptions } from "next-auth";
import { authenticateUser } from "../utils/dbUtils";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
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
                if (!credentials?.username || !credentials.password) {
                    throw new Error("Invalid credentials")
                }
                let userFromDb = await authenticateUser(credentials?.username!, credentials?.password!)
                return userFromDb;
            },
        })
    ],
    callbacks: {
        jwt: ({token, user}) => {
            // when we signin, user object is passed (for token creation)
            // we can use this user object, to pass fields that we want in the token
            if(user) {
                // triggered on signin
                return {
                    ...token,
                    id: user.id
                }
            }
            return token
        },
        session: ({session, token}) => {
            // This is called after the JWT callback
            // This will return a session which can be used by us in the application
            // via useSession/useServersideSession
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                }
            }
        }
    },
}

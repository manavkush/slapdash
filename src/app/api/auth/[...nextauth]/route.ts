import NextAuth, {type NextAuthOptions} from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { authenticateUser, getUserInfoFromDB, insertUserInDB } from "@/src/utils/dbUtils"
import { User } from "@prisma/client"

const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },
    providers : [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "username", type: "text", placeholder: "username" },
                password: { label: "password", type: "password", placeholder: "password" }
            }, 
            async authorize(credentials) {
                console.log("Credentials: ", credentials)
                let userFromDb = await authenticateUser(credentials?.username!, credentials?.password!)
                let returnUser = userFromDb ? {
                    "id" : userFromDb.id,
                    "username": userFromDb.username,
                    "bio": userFromDb.bio,
                    "name": userFromDb.name,
                    "profilePic": userFromDb.profilePic
                } : null
                
                return returnUser
            },
        })
    ],
}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}
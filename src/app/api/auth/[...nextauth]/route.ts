import NextAuth, {type NextAuthOptions} from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
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
                username: { label: "Username", type: "text", placeholder: "username" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user = { id: "1", name: "Saloni", email: "test@test.com"}
                console.log(user)
                return user
            },
        })
    ]
}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}
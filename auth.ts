import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
        name: "Credentials",
        credentials: {
            username: { label: "username", type: "text" },
            password: { label: "password", type: "password" }
        },
        async authorize(credentials) {
            try {
                const formData = "username="+credentials.username+"&password="+credentials.password
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}token`,
                    {
                        method: "POST",
                        headers: {
                            'accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: formData
                        
                    }
                );

                if (response.ok) {
                    const data = await response.json()
                    return {
                        id: data.access_token,
                        token: data.access_token,
                        username: credentials.username
                    };
                }
                return null;
            } catch (error) {
                console.error("Authentication error:", error);
                return null;
            }
        }
        })
    ],
    callbacks: {
        async jwt({ token, user }:{token:any,user:any}) {
            if (user) token.accessToken = user.token;
            return token;
        },
        async session({ session, token }:{session:any,token:any}) {
            session.user = token.accessToken;
            return session;
        }
    },
    secret: process.env.SECRET_KEY,
    pages: {
        signIn: "/login"
    }
};

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth(authOptions);
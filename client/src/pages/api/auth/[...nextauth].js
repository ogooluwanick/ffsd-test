import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { BASE_URL } from "@/utils";

export const authOptions = {
        providers: [
                CredentialsProvider({
                        name: "Credentials",
                        credentials: {
                                email: { label: "Email", type: "email" },
                                password: { label: "Password", type: "password" }
                        },
                        async authorize(credentials) {
                                try {
                                        const response = await fetch(`${BASE_URL}/users/signin`, {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                        email: credentials.email,
                                                        password: credentials.password,
                                                }),
                                        });

                                        const data = await response.json();

                                        if (response.ok && data.result) {
                                                // Restructure the returned data to match what NextAuth expects
                                                return {
                                                        id: data.result._id || data.result.id,
                                                        email: data.result.email,
                                                        name: data.result.name,
                                                        token: data.token,
                                                        ...data.result  // spread other user data
                                                };
                                        }
                                        return null;
                                } catch (error) {
                                        throw new Error("Invalid credentials");
                                }
                        },
                }),
        ],
        callbacks: {
                async jwt({ token, user, account }) {
                        if (user && account) {
                                return {
                                        ...token,
                                        accessToken: user.token,
                                        user: {
                                                id: user._id,
                                                email: user.email,
                                                name: user.name,
                                                // Include any other user data you need
                                        }
                                };
                        }
                        return token;
                },
                async session({ session, token }) {
                        // Add the token and user data to the session
                        session.accessToken = token.accessToken;
                        session.user = {
                                ...session.user,
                                ...token.user,
                        };
                        return session;
                },
        },
        pages: {
                signIn: "/signin",
        },
        session: {
                strategy: "jwt",
                maxAge: 30 * 24 * 60 * 60, // 30 days
        },
};

export default NextAuth(authOptions);
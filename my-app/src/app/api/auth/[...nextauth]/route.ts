import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../lib/mongodb"; // Changed to use the @ alias for safety
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const client = await clientPromise;
        const db = client.db("intern_system");
        
        // 1. Find the user in the database
        const user = await db.collection("users").findOne({ email: credentials.email });
        if (!user) {
          return null; // User not found
        }

        // 2. Check if the password matches the hashed password in DB
        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordsMatch) {
          return null; // Incorrect password
        }

        // 3. Return the user object (this gets saved in the session)
        return { 
          id: user._id.toString(), 
          name: user.name, 
          email: user.email, 
          role: user.role 
        };
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET, // Required for Next.js 16 / Turbopack
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.sub; // Attach the MongoDB _id to the session
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // This tells NextAuth to use our custom UI instead of the default one
  }
});

export { handler as GET, handler as POST };
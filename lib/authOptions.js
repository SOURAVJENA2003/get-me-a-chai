import GoogleProvider from "next-auth/providers/google";
import mongoose from "mongoose";
import connectDb from "@/db/connectDB";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async jwt({ token, trigger, session }) {
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }

      return token;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },

    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      if (!user?.email) {
        return false;
      }

      try {
          await connectDb();

        const currentUser = await User.findOne({ email: user.email });

        if (!currentUser) {
          const username = user.email.split("@")[0];
          const newUser = new User({
            email: user.email,
            name: user.name,
            username,
            profilepic: user.image,
          });

          await newUser.save();
          user.name = newUser.username;
        } else {
          user.name = currentUser.username;
        }

        return true;
      } catch (error) {
        console.error("Google sign-in callback error:", error);
        return true;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

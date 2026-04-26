import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { AuthProvider } from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Get me A Chai - Fund your Project with Chai",
  description: "Get me A Chai is a platform that allows you to fund your projects with Chai, a popular Indian tea. Whether you're an entrepreneur, artist, or developer, you can use Get me A Chai to raise funds for your project and connect with a community of tea lovers. Start your fundraising journey today and get the support you need to bring your project to life!",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
        <body className="min-h-screen flex flex-col overflow-x-hidden overflow-y-auto
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-gray-100
      [&::-webkit-scrollbar-thumb]:bg-gray-300
      dark:[&::-webkit-scrollbar-track]:bg-neutral-700
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        <AuthProvider>
          <Navbar />
          <div className="flex-1 text-white bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-size-[20px_20px]">
            {children}
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

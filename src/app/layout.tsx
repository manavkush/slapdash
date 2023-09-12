import Link from "next/link";
import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import Navbar from "../components/Navbar/Navbar";
import { NextAuthProvider } from "./providers";
import { GlobalContextProvider } from "../context/GlobalContext";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${spaceGrotesk.className}`}>
          <NextAuthProvider>
            <GlobalContextProvider>
              <Navbar />
              {children}
            </GlobalContextProvider>
          </NextAuthProvider>
      </body>
    </html>
  );
}

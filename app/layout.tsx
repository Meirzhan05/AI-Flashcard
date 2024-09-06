import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "@/components/navbar";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "FlashAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className} style={{
          backgroundColor: '#080808',
          margin: 0,
          padding: 0,  
        }}>
          
          <NavBar />
          {children}

        </body>
      </html>
    </ClerkProvider>
    
  );
}

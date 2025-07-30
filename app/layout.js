import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nivesto",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-black`}>
          {/*header*/}
          <Header />

          <main className="min-h-screen ">{children}</main>
          <Toaster richColors />
          {/* footer */}
          <footer className="bg-transparent py-12">
            <div className="container mx-auto px-4 text-center text-gray-400">
              © {new Date().getFullYear()} Nivesto. All rights reserved. |
              <a href="/privacy" className="hover:underline mx-1">
                Privacy Policy
              </a>{" "}
              |
              <a href="/terms" className="hover:underline mx-1">
                Terms of Service
              </a>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}

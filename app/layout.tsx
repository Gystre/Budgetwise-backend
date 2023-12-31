import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "./components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Budgetwise Backend Intern Challenge",
  description: ":D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div
          className="grid min-h-screen max-w-5xl m-auto md:px-0"
          style={{ gridTemplateRows: "auto 1fr auto" }}
        >
          <Navbar />

          <main>
            <div className="my-8">{children}</div>
          </main>

          <footer></footer>
        </div>
      </body>
    </html>
  );
}

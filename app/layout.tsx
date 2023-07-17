import { Toaster } from "react-hot-toast";
import { inter, MonaSans } from "./fonts";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ArtWalk",
  description: "Walk your art, art your walk!",
  icons: "/logo.svg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-primary-100">
      <body
        className={`${inter.className} ${inter.variable} ${MonaSans.variable}`}
      >
        <Toaster position="bottom-center" />
        {children}
      </body>
    </html>
  );
}

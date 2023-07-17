import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
  variable: "--font-inter",
});

export const MonaSans = localFont({
  src: "Mona-Sans.woff2",
  variable: "--font-mona-sans",
});

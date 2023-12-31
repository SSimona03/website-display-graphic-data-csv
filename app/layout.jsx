import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "../components/navbar"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Line Chart",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          className="viewport"
          content="width=device-width, initial-scale=1.0"
        />
      </head>
      <body>
      <Navbar />
        {children}</body>
    </html>
  );
}

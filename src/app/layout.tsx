import type { Metadata } from "next";
import "./globals.css";
import { annie } from "@/fonts/google-fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${annie.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

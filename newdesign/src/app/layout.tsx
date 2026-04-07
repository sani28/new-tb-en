/* eslint-disable @next/next/no-css-tags */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seoul City Tour Tiger Bus",
  description: "Seoul City Tour Tiger Bus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
	        {/* Legacy pages use lots of relative URLs like `imgs/...` (including in inline CSS/JS). */}
	        <base href="/" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

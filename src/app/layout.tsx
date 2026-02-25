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
        {/* Legacy prototype CSS — load order matters for cascade */}
        <link rel="stylesheet" href="/styles.css" />
	        <link rel="stylesheet" href="/css/components/carousel.css" />
		        <link rel="stylesheet" href="/css/components/promo-addons-carousel.css" />
        <link rel="stylesheet" href="/template.css" />
        <link rel="stylesheet" href="/discounts.css" />
			{/* Homepage-only styles are scoped to `body.index-page` */}
			<link rel="stylesheet" href="/css/pages/home.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}

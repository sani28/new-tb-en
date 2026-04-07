// Root layout — pass-through shell.
// The real <html>/<body> is in [locale]/layout.tsx.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

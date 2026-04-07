import Footer from "@/components/layout/Footer";
import SiteHeader from "@/components/layout/SiteHeader";

export default function BookingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader />
      {children}
      <Footer />
    </>
  );
}

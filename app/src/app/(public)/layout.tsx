import Navigation from "@/components/Navigation";
import FooterSection from "@/components/sections/FooterSection";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      {children}
      <FooterSection />
    </>
  );
}

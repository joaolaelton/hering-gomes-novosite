import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Hering Gomes Advocacia | Especialistas em Resultados",
  description: "Atuamos na defesa de Servidores Públicos, Direito Tributário, Empresarial, Civil, Processual Civil e Administrativo — com estratégia, precisão técnica e comprometimento real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="relative bg-charcoal min-h-screen font-inter antialiased text-[#F4F6FB] overflow-x-hidden pt-0 m-0">
        {/* Grain Overlay global */}
        <div className="grain-overlay" />
        
        {children}
      </body>
    </html>
  );
}

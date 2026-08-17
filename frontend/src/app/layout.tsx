import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider"; // <-- Importamos esto

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zonasyc",
  description: "Cultura pop, cine, series y gaming con velocidad extrema.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Agregamos suppressHydrationWarning para que Next-Themes funcione perfecto
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-slate-950 transition-colors duration-300`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
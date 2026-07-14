import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apex Athletics - أنظمة برمجية احترافية",
  description: "Apex Athletics - شركة رائدة في تطوير الأنظمة البرمجية لجميع المجالات. نظام صيدلية، جيم، بقالة، قطع غيار، مستشفى، وشركات.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}

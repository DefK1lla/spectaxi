import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/_app/providers";
import "@/_app/styles/globals.css";

export const metadata: Metadata = {
  title: "SpexTaxi",
  description: "Маркетплейс спецтехники SpexTaxi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru" data-theme="light">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { ReactNode } from "react";
import { AppProviders } from "./providers/AppProviders";
import "../index.css";
import "../App.css";

export const metadata = {
  title: "Desafio E-Commerce",
  description: "Loja demo migrada para Next.js e NestJS",
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
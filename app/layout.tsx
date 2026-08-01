import "./globals.css";
import { Oswald, Rajdhani, Share_Tech_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import RadarBg from "@/components/RadarBg";

const display = Oswald({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-display", display: "swap" });
const body = Rajdhani({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body", display: "swap" });
const mono = Share_Tech_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-mono", display: "swap" });

export const metadata = {
  title: "FRONT BLOCK — милитари-сервер",
  description: "Две фракции, фронт, техника и FPV-дроны. Сервер в разработке — открыта регистрация.",
};

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <RadarBg />
        <Nav />
        <main className="shell">{children}</main>
        <footer className="foot">FRONT BLOCK © 2026 · фанатский проект, не связан с Mojang</footer>
      </body>
    </html>
  );
}

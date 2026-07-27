import "./globals.css";
import { Oswald, Rajdhani, Share_Tech_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import RadarBg from "@/components/RadarBg";

const display = Oswald({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });
const body = Rajdhani({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-body" });
const mono = Share_Tech_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-mono" });

export const metadata = { title: "FRONT BLOCK — милитари-сервер", description: "Две фракции, фронт 5 км, техника и FPV-дроны." };

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <RadarBg />
        <Nav />
        <main className="shell">{children}</main>
        <footer className="foot"><span>FRONT BLOCK</span><span className="muted">© 2026 · Front Block</span></footer>
      </body>
    </html>
  );
}

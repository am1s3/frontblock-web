
import "./globals.css";
export const metadata = { title: "Front Block", description: "Military Minecraft server" };
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="ru"><body>{children}</body></html>;
}

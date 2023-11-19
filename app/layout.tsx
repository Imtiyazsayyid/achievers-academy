import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Container, Theme, ThemePanel } from "@radix-ui/themes";
import "../theme-config.css";
import NavBar from "./admin/NavBar";
import { Toaster } from "react-hot-toast";
import GoBack from "./components/GoBack";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.variable + " min-h-screen"}>
        <Theme accentColor="violet">
          <main className="bg-slate-100 min-h-screen">
            <Toaster />
            {children}
          </main>
        </Theme>
      </body>
    </html>
  );
}

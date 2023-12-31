import type { Metadata } from "next";
// import { Poppins } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import {
  Container,
  Theme,
  ThemePanel,
  useThemeContext,
} from "@radix-ui/themes";
import "../theme-config.css";
import NavBar from "./admin/NavBar";
import { Toaster } from "react-hot-toast";
import GoBack from "./components/GoBack";
import AuthProvider from "./auth/Provider";

// const poppins = Poppins({
//   weight: ["300", "400", "500", "600", "700", "800", "900"],
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-poppins",
// });

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* poppins.variable + "  */}
      <body className={""}>
        <Theme accentColor="violet">
          <Toaster />
          <AuthProvider>
            {/* bg-slate-100  */}
            <main className={`h-screen bg-slate-100`}>{children}</main>
          </AuthProvider>
        </Theme>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import "./fluid.css";
import "./mobile.css";

export const metadata: Metadata = {
  title: "AMR-Eye.AI — APEX XR Explorer & AST Demonstration",
  description: "Explore 22 proposed subsystems, 20 use cases and a synthetic AST workflow, based on the September 2026 APEX XR dossier.",
  applicationName: "AMR-Eye.AI",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "AMR-Eye",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/amr-eye-icon.png",
    shortcut: "/amr-eye-icon.png",
    apple: "/amr-eye-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#031018" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import "./fluid.css";
import "./mobile.css";
import "./workspace.css";
import "./atelier.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://amreye.in"),
  alternates: { canonical: "/" },
  title: "AMR-Eye.AI  ·  Instruments, Research & Project Library",
  description: "Explore 22 proposed subsystems, 20 use cases and a synthetic AST workflow, based on the September 2026 APEX XR dossier.",
  applicationName: "AMR-Eye.AI",
  openGraph: {
    type: "website",
    url: "https://amreye.in/",
    siteName: "AMR-Eye.AI",
    title: "AMR-Eye.AI · Instruments, Research & Project Library",
    description: "Explore the AMR-Eye prototype, proposed instruments, research library and synthetic AST demonstration.",
  },
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
        <meta name="theme-color" content="#0b0c0e" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

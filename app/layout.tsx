import type { Metadata } from "next";
import "./globals.css";
import "./fluid.css";
import "./mobile.css";
import "./workspace.css";
import "./atelier.css";
import "./connected.css";
import "./precision.css";
import "./library.css";
import "./library-fixes.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://amreye.in"),
  alternates: { canonical: "/" },
  title: "AMReye.AI  ·  Instruments, Research & Project Library",
  description: "Explore the plate-reader prototype, proposed laboratory platform, research pathways and a synthetic AST demonstration.",
  applicationName: "AMReye.AI",
  openGraph: {
    images: [{url:"/og.png",width:1200,height:630,alt:"AMReye.AI: Measure the plate. Connect the record."}],
    type: "website",
    url: "https://amreye.in/",
    siteName: "AMReye.AI",
    title: "AMReye.AI · Instruments, Research & Project Library",
    description: "Explore the AMReye.AI prototype, proposed instruments, research library and synthetic AST demonstration.",
  },
  twitter: {card:"summary_large_image",title:"AMReye.AI",description:"Measure the plate. Connect the record.",images:["/og.png"]},
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "AMReye.AI",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [{url:"/favicon.svg",type:"image/svg+xml"},{url:"/amr-eye-icon.png",sizes:"512x512",type:"image/png"}],
    shortcut: "/amr-eye-icon.png",
    apple: "/brand/icon-180.png",
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

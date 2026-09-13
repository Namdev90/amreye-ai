import type { Metadata } from "next";
import "./globals.css";
import "./fluid.css";
import "./mobile.css";
import "./workspace.css";
import "./atelier.css";
import "./connected.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://amreye.in"),
  alternates: { canonical: "/" },
  title: "AMREye  ·  Instruments, Research & Project Library",
  description: "Explore the plate-reader prototype, proposed laboratory platform, research pathways and a synthetic AST demonstration.",
  applicationName: "AMREye",
  openGraph: {
    images: [{url:"/og.png",width:1730,height:909,alt:"AMREye: Measure the plate. Connect the record."}],
    type: "website",
    url: "https://amreye.in/",
    siteName: "AMREye",
    title: "AMREye · Instruments, Research & Project Library",
    description: "Explore the AMREye prototype, proposed instruments, research library and synthetic AST demonstration.",
  },
  twitter: {card:"summary_large_image",title:"AMREye",description:"Measure the plate. Connect the record.",images:["/og.png"]},
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "AMREye",
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

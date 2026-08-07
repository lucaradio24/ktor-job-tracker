import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { headers } from "next/headers";
import { PREFERENCES_INITIALIZER_SCRIPT } from "@/features/preferences/preferences";
import "@/styles/tokens.css";
import "@/styles/base.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const title = "Job Tracker | Le tue candidature";
const description =
  "Organizza candidature, colloqui e offerte in un'unica dashboard.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: metadataBase,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={manrope.variable}
      suppressHydrationWarning
    >
      <head>
        <script
          id="jobtracker-preferences"
          dangerouslySetInnerHTML={{ __html: PREFERENCES_INITIALIZER_SCRIPT }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/lib/AuthContext';
import { GoogleMapsProvider } from '@/lib/GoogleMapsProvider';
import { TelemetryProvider } from '@/lib/components/TelemetryProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    template: '%s | Touris',
    default: 'Touris - Tourisme en Haïti',
  },
  description: 'Découvrez les merveilles d\'Haïti : hôtels, restaurants, sites touristiques et bien plus encore.',
  keywords: ['Haïti', 'tourisme', 'voyage', 'hôtels', 'restaurants', 'sites touristiques'],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <GoogleOAuthProvider clientId="955108400371-uik3onuhrlibvaik5l6j0a28t8ajg0sd.apps.googleusercontent.com">
            <AuthProvider>
              <GoogleMapsProvider>
                <TelemetryProvider>
                  {children}
                </TelemetryProvider>
              </GoogleMapsProvider>
            </AuthProvider>
          </GoogleOAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

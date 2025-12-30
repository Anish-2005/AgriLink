import { Inter } from "next/font/google";
import "./globals.css";
import { CivicAuthProvider } from "@civic/auth/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: 'AgriLink',
    template: '%s | AgriLink'
  },
  description: 'AgriLink — marketplace connecting farmers with industries to turn agricultural waste into value. Buy, sell, and track waste listings, payments, and carbon impact.',
  keywords: ['AgriLink', 'agricultural waste', 'marketplace', 'farmers', 'carbon impact', 'waste to wealth', 'buy agricultural waste'],
  authors: [{ name: 'AgriLink', url: 'https://your-domain.com' }],
  icons: {
    icon: '/agrilink.png'
  },
  openGraph: {
    title: 'AgriLink',
    description: 'Premium marketplace for agricultural waste — connect with verified industrial buyers, track earnings and CO₂ impact.',
    url: 'https://your-domain.com',
    siteName: 'AgriLink',
    images: [
      {
        url: 'https://your-domain.com/agrilink.png',
        alt: 'AgriLink logo'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgriLink',
    description: 'Marketplace turning agricultural waste into value — sell, buy, and measure CO₂ impact.',
    images: ['https://your-domain.com/agrilink.png']
  },
  robots: {
    index: true,
    follow: true,
    nocache: false
  }
};

import { ReactNode } from "react";
import ScrollToTopButton from "./components/ScrollToTopButton";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#10b981" />
        <link rel="icon" href="/agrilink.png" />
        <link rel="canonical" href="https://your-domain.com" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "AgriLink",
          "url": "https://your-domain.com",
          "logo": "https://your-domain.com/agrilink.png",
          "sameAs": []
        }) }} />
        <script src="https://js.puter.com/v2/" />
      </head>
      <body className={inter.className}>
        <CivicAuthProvider>
          {children}
          <ScrollToTopButton />
        </CivicAuthProvider>
      </body>
    </html>
  );
}

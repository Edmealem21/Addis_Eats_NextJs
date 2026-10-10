// src/app/layout.js
import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import CartButton from "@/components/CartButton";
import SignOutButton from "@/components/SignOutButton";
import MobileNav from "@/components/MobileNav";
import AnalyticsScript from "@/components/AnalyticsScript";
import { getSession } from "@/lib/session";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Authentic Ethiopian Food, Delivered`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Ethiopian food", "Addis Ababa delivery", "injera", "doro wat",
    "kitfo", "shiro", "food delivery",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
    title: `${SITE_NAME} — Authentic Ethiopian Food, Delivered`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Authentic Ethiopian Food, Delivered`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({ children }) {
  const session = await getSession();

  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen bg-stone-50 text-stone-900 flex flex-col`}>
        <Providers>
          <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-4">
              <Link href="/" className="font-bold text-amber-700">Addis Eats</Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link href="/menu" className="hover:text-amber-700">Menu</Link>
                <CartButton />
                <Link href="/orders" className="hover:text-amber-700">My Orders</Link>
                <Link href="/checkout" className="hover:text-amber-700">Checkout</Link>
                {session?.role === "staff" && (
                  <Link href="/kitchen" className="hover:text-amber-700">Kitchen</Link>
                )}
              </nav>

              <div className="ml-auto flex items-center gap-3">
                <div className="hidden md:block">
                  {session ? <SignOutButton /> : (
                    <Link href="/signin" className="text-amber-700">Sign in</Link>
                  )}
                </div>
                <MobileNav session={session} />
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
            {children}
          </main>

          <footer className="border-t bg-white">
            <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-stone-500">
              © 2026 Addis Eats · Bole, Addis Ababa Ethiopia
            </div>
          </footer>
        </Providers>

        <AnalyticsScript />
      </body>
    </html>
  );
}
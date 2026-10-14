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
<div className="flex items-center justify-between gap-6 px-6 py-4">
  {/* ── LEFT: logo ── */}
  <Link
    href="/"
    className="shrink-0 font-bold text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
  >
    Addis Eats
  </Link>

  {/* ── CENTER: nav takes all remaining space, centers its contents ── */}
  <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
    <Link href="/menu" className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2">
      Menu
    </Link>
    <CartButton />
    <Link href="/orders" className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2">
      My Orders
    </Link>
    <Link href="/checkout" className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2">
      Checkout
    </Link>
    <Link href="/admin" className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2">
      Admin
    </Link>
    {session?.role === "staff" && (
      <Link href="/kitchen" className="hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2">
        Kitchen
      </Link>
    )}
  </nav>

  {/* ── RIGHT: sign in/out + mobile nav ── */}
  <div className="flex shrink-0 items-center justify-end gap-3">
    <div className="hidden md:block">
      {session ? (
        <SignOutButton />
      ) : (
        <Link href="/signin" className="text-amber-700">
          Sign in
        </Link>
      )}
    </div>
    <MobileNav session={session} />
  </div>
</div>
          </header>

          <main className="mx-auto w-full  flex-1 px-4 py-8">
            {children}
          </main>

          <footer className="border-t bg-white">
            <div className="mx-auto px-4 py-6 text-sm text-stone-500">
              © 2026 Addis Eats · Bole, Addis Ababa
            </div>
          </footer>
        </Providers>

        <AnalyticsScript />
      </body>
    </html>
  );
}
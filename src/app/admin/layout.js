// src/app/admin/layout.js
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Sidebar from "./Sidebar";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }) {
  const session = await getSession();
  if (!session) redirect("/signin?next=/admin");
  if (session.role !== "staff") redirect("/");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#F5F0EC]">
      <Sidebar user={session} />
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
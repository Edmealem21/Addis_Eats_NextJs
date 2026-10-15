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
  <div className="-mx-6 -my-8 flex min-h-[calc(100vh-4rem)] bg-[#F5F0EC] sm:-mx-10 lg:-mx-16">
    <Sidebar user={session} />
    <main className="flex-1 p-6 lg:p-8">{children}</main>
  </div>
);
}
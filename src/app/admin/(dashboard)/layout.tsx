import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-base md:flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar userName={session.user?.name ?? session.user?.email ?? "Admin"} />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { AppHeader } from "@/components/layout/app-header";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:"#050508" }}>
      <Sidebar />
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden" }}>
        <AppHeader />
        <main style={{ flex:1, overflowY:"auto" }}>{children}</main>
      </div>
    </div>
  );
}

"use client";
import { Menu, Settings2, Zap, ChevronDown } from "lucide-react";
import { useChatStore, useSettingsStore } from "@/store/chat";
import { useRouter, usePathname } from "next/navigation";

const TITLES: Record<string,string> = {
  "/dashboard":"Dashboard", "/settings":"Settings", "/chat":"New Chat"
};

export function AppHeader() {
  const { sidebarOpen, setSidebarOpen } = useChatStore();
  const { model } = useSettingsStore();
  const router   = useRouter();
  const pathname = usePathname();
  const title    = pathname.startsWith("/chat/") ? "Chat" : TITLES[pathname] ?? "NeuralChat";
  const isChat   = pathname.startsWith("/chat");

  return (
    <header style={{
      height:"52px", display:"flex", alignItems:"center", gap:"0.75rem", padding:"0 1.25rem",
      borderBottom:"1px solid rgba(255,255,255,0.05)",
      background:"rgba(5,5,8,0.85)", backdropFilter:"blur(20px)",
      flexShrink:0, fontFamily:"'Inter',system-ui,sans-serif"
    }}>
      {/* Sidebar toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ padding:"6px", borderRadius:"8px", background:"none", border:"none",
          color:"#4a4a6a", cursor:"pointer", display:"flex", transition:"all 0.15s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.06)"; (e.currentTarget as HTMLButtonElement).style.color="#9090b8"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background="none"; (e.currentTarget as HTMLButtonElement).style.color="#4a4a6a"; }}>
        <Menu size={18} />
      </button>

      {/* Title */}
      <span style={{ flex:1, fontSize:"0.9rem", fontWeight:600, color:"#e0e0ff" }}>{title}</span>

      {/* Model badge */}
      {isChat && (
        <button onClick={() => router.push("/settings")}
          style={{ display:"flex", alignItems:"center", gap:"0.375rem", padding:"0.375rem 0.75rem",
            background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)",
            borderRadius:"8px", color:"#a5b4fc", fontSize:"0.75rem", fontWeight:500,
            cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background="rgba(99,102,241,0.15)"}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background="rgba(99,102,241,0.1)"}>
          <Zap size={12} />
          {model}
          <ChevronDown size={11} style={{ color:"#6b6b9a" }} />
        </button>
      )}

      {/* Settings */}
      <button onClick={() => router.push("/settings")}
        style={{ padding:"6px", borderRadius:"8px", background: pathname==="/settings" ? "rgba(99,102,241,0.15)" : "none",
          border:"none", color: pathname==="/settings" ? "#6366f1" : "#4a4a6a", cursor:"pointer",
          display:"flex", transition:"all 0.15s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.06)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background=pathname==="/settings"?"rgba(99,102,241,0.15)":"none"; }}>
        <Settings2 size={17} />
      </button>
    </header>
  );
}

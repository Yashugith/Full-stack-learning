"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Plus, MessageSquare, Search, Trash2, Settings, ChevronLeft, Sparkles, Sun, Moon, LogOut } from "lucide-react";
import { useChatStore } from "@/store/chat";
import { useTheme } from "next-themes";
import axios from "axios";
import toast from "react-hot-toast";
import type { Conversation } from "@/types";

export function Sidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  const qc = useQueryClient();
  const { sidebarOpen, setSidebarOpen, activeConversationId, setActiveConversationId } = useChatStore();
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string|null>(null);
  const { theme, setTheme } = useTheme();

  const { data, isLoading } = useQuery({
    queryKey: ["conversations", search],
    queryFn: async () => (await axios.get(`/api/conversations?search=${encodeURIComponent(search)}`)).data as { data: Conversation[] },
    enabled: !!session
  });

  const deleteMutation = useMutation({
    mutationFn: (id:string) => axios.delete(`/api/conversations?id=${id}`),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
      if (activeConversationId === id) { setActiveConversationId(null); router.push("/dashboard"); }
      toast.success("Deleted");
    }
  });

  const conversations = data?.data ?? [];

  const SB: React.CSSProperties = {
    position:"fixed", left:0, top:0, height:"100vh", zIndex:40,
    width: sidebarOpen ? "256px" : "0px",
    overflow:"hidden",
    transition:"width 0.3s cubic-bezier(0.16,1,0.3,1)",
    background:"rgba(8,8,16,0.97)",
    backdropFilter:"blur(30px)",
    borderRight:"1px solid rgba(255,255,255,0.06)",
    display:"flex", flexDirection:"column",
    fontFamily:"'Inter',system-ui,sans-serif"
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:30, backdropFilter:"blur(4px)" }}
            className="lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      <div style={SB}>
        <div style={{ width:"256px", height:"100%", display:"flex", flexDirection:"column" }}>

          {/* Logo */}
          <div style={{ padding:"1.25rem 1rem", borderBottom:"1px solid rgba(255,255,255,0.05)",
            display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.625rem" }}>
              <div style={{ width:"32px", height:"32px", borderRadius:"10px",
                background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 0 20px rgba(99,102,241,0.4)" }}>
                <Sparkles size={16} color="white" />
              </div>
              <span style={{ fontWeight:700, fontSize:"1rem", background:"linear-gradient(135deg,#fff,#a5b4fc)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                NeuralChat
              </span>
            </div>
          </div>

          {/* New Chat */}
          <div style={{ padding:"0.875rem 0.875rem 0.5rem" }}>
            <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.97 }}
              onClick={() => { setActiveConversationId(null); router.push("/chat"); }}
              style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center",
                gap:"0.5rem", padding:"0.75rem",
                background:"linear-gradient(135deg, rgba(99,102,241,0.9), rgba(79,70,229,0.9))",
                border:"1px solid rgba(99,102,241,0.4)", borderRadius:"12px",
                color:"white", fontSize:"0.85rem", fontWeight:600, cursor:"pointer",
                boxShadow:"0 4px 15px rgba(99,102,241,0.3)", fontFamily:"inherit" }}>
              <Plus size={15} /> New Chat
            </motion.button>
          </div>

          {/* Search */}
          <div style={{ padding:"0 0.875rem 0.75rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.6rem 0.875rem",
              background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:"10px" }}>
              <Search size={13} style={{ color:"#4a4a6a", flexShrink:0 }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations..."
                style={{ background:"none", border:"none", outline:"none", fontSize:"0.8rem",
                  color:"#c0c0e0", width:"100%", fontFamily:"inherit" }} />
            </div>
          </div>

          {/* List header */}
          <div style={{ padding:"0 1rem 0.5rem" }}>
            <span style={{ fontSize:"0.68rem", fontWeight:600, color:"#3a3a5a", textTransform:"uppercase", letterSpacing:"0.08em" }}>
              Conversations
            </span>
          </div>

          {/* Conversations */}
          <div style={{ flex:1, overflowY:"auto", padding:"0 0.625rem 0.5rem" }}>
            {isLoading
              ? Array.from({length:4}).map((_,i) => (
                  <div key={i} className="skeleton" style={{ height:"40px", margin:"0 0.25rem 0.375rem",
                    opacity: 1 - i * 0.2 }} />
                ))
              : conversations.length === 0
                ? <div style={{ textAlign:"center", padding:"2rem 1rem", color:"#3a3a5a", fontSize:"0.8rem" }}>
                    {search ? "No results found" : "No conversations yet"}
                  </div>
                : conversations.map((conv, i) => (
                    <motion.div key={conv.id}
                      initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.04 }}
                      onMouseEnter={() => setHoveredId(conv.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => { setActiveConversationId(conv.id); router.push(`/chat/${conv.id}`); }}
                      style={{ display:"flex", alignItems:"center", gap:"0.5rem",
                        padding:"0.625rem 0.75rem", borderRadius:"10px", cursor:"pointer",
                        marginBottom:"2px", transition:"all 0.15s",
                        background: activeConversationId === conv.id
                          ? "rgba(99,102,241,0.12)"
                          : hoveredId === conv.id ? "rgba(255,255,255,0.04)" : "transparent",
                        border: activeConversationId === conv.id
                          ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent" }}>
                      <MessageSquare size={13} style={{ color: activeConversationId === conv.id ? "#6366f1" : "#3a3a5a", flexShrink:0 }} />
                      <span style={{ flex:1, fontSize:"0.8rem", color: activeConversationId === conv.id ? "#c7d2fe" : "#7070a0",
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {conv.title}
                      </span>
                      <AnimatePresence>
                        {(hoveredId === conv.id || activeConversationId === conv.id) && (
                          <motion.button initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.8}}
                            onClick={e => { e.stopPropagation(); deleteMutation.mutate(conv.id); }}
                            style={{ background:"none", border:"none", cursor:"pointer", padding:"2px",
                              borderRadius:"5px", display:"flex", color:"#4a4a6a",
                              transition:"color 0.15s" }}
                            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color="#ef4444"}
                            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color="#4a4a6a"}>
                            <Trash2 size={12} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))
            }
          </div>

          {/* Footer */}
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", padding:"0.75rem 0.625rem" }}>
            {[
              { icon:Settings, label:"Settings", action:() => router.push("/settings") },
              { icon: theme==="dark" ? Sun : Moon, label: theme==="dark" ? "Light mode" : "Dark mode",
                action:() => setTheme(theme==="dark" ? "light" : "dark") }
            ].map(item => (
              <button key={item.label} onClick={item.action}
                style={{ width:"100%", display:"flex", alignItems:"center", gap:"0.625rem",
                  padding:"0.6rem 0.75rem", borderRadius:"10px", background:"none", border:"none",
                  color:"#4a4a6a", fontSize:"0.8rem", cursor:"pointer", marginBottom:"2px",
                  fontFamily:"inherit", transition:"all 0.15s", textAlign:"left" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background="rgba(255,255,255,0.04)"; (e.currentTarget as HTMLButtonElement).style.color="#9090b8"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background="none"; (e.currentTarget as HTMLButtonElement).style.color="#4a4a6a"; }}>
                <item.icon size={15} />
                {item.label}
              </button>
            ))}

            {/* User */}
            {session?.user && (
              <div style={{ display:"flex", alignItems:"center", gap:"0.625rem",
                padding:"0.625rem 0.75rem", marginTop:"0.25rem",
                background:"rgba(255,255,255,0.02)", borderRadius:"10px",
                border:"1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ width:"30px", height:"30px", borderRadius:"50%", flexShrink:0,
                  background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"0.75rem", fontWeight:700, color:"white" }}>
                  {(session.user.name ?? session.user.email ?? "?")[0].toUpperCase()}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:"0.78rem", fontWeight:500, color:"#c0c0e0",
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {session.user.name ?? "User"}
                  </p>
                  <p style={{ fontSize:"0.68rem", color:"#4a4a6a",
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {session.user.email}
                  </p>
                </div>
                <button onClick={() => signOut({ callbackUrl:"/login" })}
                  style={{ background:"none", border:"none", cursor:"pointer", padding:"4px",
                    borderRadius:"6px", color:"#3a3a5a", display:"flex" }}
                  title="Sign out"
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color="#ef4444"}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color="#3a3a5a"}>
                  <LogOut size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


"use client";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MessageSquare, Zap, TrendingUp, PlusIcon, ArrowRight, Sparkles, Clock } from "lucide-react";
import axios from "axios";
import { useChatStore } from "@/store/chat";
import type { DashboardStats, Conversation } from "@/types";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { setActiveConversationId } = useChatStore();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => (await axios.get("/api/users/stats")).data as DashboardStats
  });

  const { data: conversations, isLoading: convsLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => (await axios.get("/api/conversations?pageSize=5")).data.data as Conversation[]
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  const STATS = [
    { label:"Total chats",     value: stats?.totalConversations, icon: MessageSquare, grad:"linear-gradient(135deg,#6366f1,#4f46e5)", glow:"rgba(99,102,241,0.3)" },
    { label:"Messages sent",   value: stats?.totalMessages,       icon: Zap,           grad:"linear-gradient(135deg,#f59e0b,#d97706)", glow:"rgba(245,158,11,0.3)" },
    { label:"Chats this week", value: stats?.conversationsThisWeek, icon: TrendingUp,  grad:"linear-gradient(135deg,#10b981,#059669)", glow:"rgba(16,185,129,0.3)" },
    { label:"Msgs this week",  value: stats?.messagesThisWeek,    icon: Clock,         grad:"linear-gradient(135deg,#8b5cf6,#7c3aed)", glow:"rgba(139,92,246,0.3)" },
  ];

  const S: React.CSSProperties = {
    minHeight:"100%", padding:"2.5rem 2rem",
    background:"#050508",
    fontFamily:"Inter,system-ui,sans-serif",
    maxWidth:"960px", margin:"0 auto"
  };

  return (
    <div style={S}>
      {/* Header */}
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} style={{marginBottom:"2.5rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.5rem"}}>
          <div style={{width:"36px",height:"36px",borderRadius:"12px",
            background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:"0 0 20px rgba(99,102,241,0.4)"}}>
            <Sparkles size={18} color="white" />
          </div>
          <div>
            <h1 style={{fontSize:"1.5rem",fontWeight:700,letterSpacing:"-0.02em",
              background:"linear-gradient(135deg,#fff,#a5b4fc)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              {greeting}, {firstName} 👋
            </h1>
            <p style={{fontSize:"0.82rem",color:"#4a4a6a",marginTop:"1px"}}>
              Here is an overview of your AI workspace
            </p>
          </div>
        </div>
      </motion.div>

      {/* New Chat CTA */}
      <motion.button
        initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.05}}
        whileHover={{scale:1.005,y:-2}} whileTap={{scale:0.998}}
        onClick={() => { setActiveConversationId(null); router.push("/chat"); }}
        style={{
          width:"100%", display:"flex", alignItems:"center", gap:"1rem",
          padding:"1.25rem 1.5rem", marginBottom:"1.75rem",
          background:"linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))",
          border:"1px solid rgba(99,102,241,0.2)", borderRadius:"18px",
          cursor:"pointer", fontFamily:"inherit", textAlign:"left",
          boxShadow:"0 0 40px rgba(99,102,241,0.08)",
          transition:"all 0.25s cubic-bezier(0.16,1,0.3,1)"
        }}>
        <div style={{width:"44px",height:"44px",borderRadius:"14px",
          background:"linear-gradient(135deg,#6366f1,#4f46e5)",
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
          boxShadow:"0 4px 20px rgba(99,102,241,0.4)"}}>
          <PlusIcon size={20} color="white" />
        </div>
        <div style={{flex:1}}>
          <p style={{fontSize:"0.95rem",fontWeight:600,color:"#e0e0ff",marginBottom:"2px"}}>
            Start a new conversation
          </p>
          <p style={{fontSize:"0.78rem",color:"#5a5a7a"}}>
            Powered by GPT-4o · Streaming responses · Context-aware
          </p>
        </div>
        <ArrowRight size={18} style={{color:"#4a4a6a",flexShrink:0}} />
      </motion.button>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.875rem",marginBottom:"2rem"}}>
        {STATS.map((s,i) => (
          <motion.div key={s.label}
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1+i*0.07}}
            style={{padding:"1.25rem",
              background:"rgba(14,14,22,0.9)",
              border:"1px solid rgba(255,255,255,0.06)",
              borderRadius:"16px",
              boxShadow:`0 0 30px ${s.glow.replace("0.3","0.06")}`}}>
            <div style={{width:"36px",height:"36px",borderRadius:"10px",
              background:s.grad,display:"flex",alignItems:"center",justifyContent:"center",
              marginBottom:"0.875rem",boxShadow:`0 4px 12px ${s.glow}`}}>
              <s.icon size={17} color="white" />
            </div>
            {statsLoading
              ? <div className="skeleton" style={{height:"28px",width:"48px",marginBottom:"6px"}} />
              : <p style={{fontSize:"1.6rem",fontWeight:700,color:"#f0f0ff",
                  letterSpacing:"-0.02em",lineHeight:1}}>{s.value ?? 0}</p>}
            <p style={{fontSize:"0.73rem",color:"#4a4a6a",marginTop:"4px"}}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent conversations */}
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.35}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"}}>
          <h2 style={{fontSize:"0.85rem",fontWeight:600,color:"#6060a0",textTransform:"uppercase",letterSpacing:"0.06em"}}>
            Recent Conversations
          </h2>
          <button onClick={() => router.push("/chat")}
            style={{fontSize:"0.78rem",color:"#6366f1",background:"none",border:"none",
              cursor:"pointer",fontFamily:"inherit"}}>
            View all →
          </button>
        </div>

        {convsLoading
          ? Array.from({length:3}).map((_,i) => (
              <div key={i} className="skeleton" style={{height:"68px",borderRadius:"14px",marginBottom:"0.625rem"}} />
            ))
          : (conversations ?? []).length === 0
            ? (
              <div style={{textAlign:"center",padding:"3rem",
                background:"rgba(14,14,22,0.5)",border:"1px solid rgba(255,255,255,0.04)",
                borderRadius:"16px"}}>
                <p style={{fontSize:"2rem",marginBottom:"0.5rem"}}>💬</p>
                <p style={{color:"#4a4a6a",fontSize:"0.875rem"}}>No conversations yet</p>
                <p style={{color:"#3a3a5a",fontSize:"0.78rem",marginTop:"4px"}}>Start chatting to see your history here</p>
              </div>
            )
            : (conversations ?? []).map((conv, i) => (
                <motion.button key={conv.id}
                  initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.4+i*0.06}}
                  whileHover={{x:4}} whileTap={{scale:0.99}}
                  onClick={() => { setActiveConversationId(conv.id); router.push("/chat/"+conv.id); }}
                  style={{
                    width:"100%", display:"flex", alignItems:"center", gap:"0.875rem",
                    padding:"1rem 1.25rem", marginBottom:"0.5rem",
                    background:"rgba(14,14,22,0.8)",
                    border:"1px solid rgba(255,255,255,0.05)",
                    borderRadius:"14px", cursor:"pointer", fontFamily:"inherit",
                    textAlign:"left", transition:"all 0.2s"
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(20,20,35,0.9)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.2)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(14,14,22,0.8)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.05)";
                  }}>
                  <div style={{width:"36px",height:"36px",borderRadius:"10px",
                    background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.15)",
                    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <MessageSquare size={15} style={{color:"#6366f1"}} />
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:"0.875rem",fontWeight:500,color:"#c0c0e0",
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {conv.title}
                    </p>
                    <p style={{fontSize:"0.75rem",color:"#3a3a5a",marginTop:"2px"}}>
                      {new Date(conv.updatedAt).toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}
                    </p>
                  </div>
                  <ArrowRight size={14} style={{color:"#3a3a5a",flexShrink:0}} />
                </motion.button>
              ))
        }
      </motion.div>
    </div>
  );
}

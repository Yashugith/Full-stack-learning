"use client";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, Sparkles, ArrowRight, ArrowLeft, Zap, Shield, Globe } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters")
});
type Form = z.infer<typeof schema>;

const FEATURES = [
  { icon: Zap,    label: "Lightning fast",   desc: "Real-time streaming responses" },
  { icon: Shield, label: "Secure & private",  desc: "Your data stays encrypted" },
  { icon: Globe,  label: "GPT-4o powered",    desc: "Latest AI models available" },
];

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get("callbackUrl") ?? "/dashboard";
  const [mode, setMode]     = useState<"options"|"email">("options");
  const [loading, setLoading] = useState<string|null>(null);
  const [error, setError]   = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const handleGoogle = async () => {
    setLoading("google");
    await signIn("google", { callbackUrl });
  };

  const handleEmail = async (data: Form) => {
    setLoading("email"); setError("");
    const res = await signIn("credentials", { email: data.email, password: data.password, redirect: false });
    setLoading(null);
    if (res?.ok) { window.location.href = callbackUrl; }
    else { setError("Invalid email or password. Try demo@neuralchat.ai / Demo1234!"); }
  };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", background:"#050508",
      fontFamily:"'Inter',system-ui,sans-serif", overflow:"hidden", position:"relative"
    }}>
      {/* Animated background */}
      <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"-20%", left:"-10%", width:"600px", height:"600px",
          background:"radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", borderRadius:"50%" }} />
        <div style={{ position:"absolute", bottom:"-20%", right:"-10%", width:"500px", height:"500px",
          background:"radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", borderRadius:"50%" }} />
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          width:"800px", height:"800px",
          background:"radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 60%)", borderRadius:"50%" }} />
        {/* Grid */}
        <div style={{ position:"absolute", inset:0,
          backgroundImage:"linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",
          backgroundSize:"60px 60px" }} />
      </div>

      {/* Left panel — features */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center",
        padding:"3rem", position:"relative", display:"none" }} className="left-panel">
      </div>

      {/* Center — auth card */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center",
        padding:"2rem", position:"relative", zIndex:10, width:"100%" }}>
        <motion.div
          initial={{ opacity:0, y:30, scale:0.95 }}
          animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
          style={{ width:"100%", maxWidth:"420px" }}
        >
          {/* Logo */}
          <div style={{ textAlign:"center", marginBottom:"2rem" }}>
            <motion.div
              initial={{ scale:0, rotate:-180 }}
              animate={{ scale:1, rotate:0 }}
              transition={{ duration:0.6, ease:[0.16,1,0.3,1], delay:0.1 }}
              style={{ display:"inline-flex", alignItems:"center", justifyContent:"center",
                width:"64px", height:"64px", borderRadius:"20px", marginBottom:"1.25rem",
                background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                boxShadow:"0 0 40px rgba(99,102,241,0.4), 0 0 80px rgba(99,102,241,0.1)" }}
            >
              <Sparkles size={28} color="white" />
            </motion.div>
            <motion.h1 initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2 }}
              style={{ fontSize:"2rem", fontWeight:700, letterSpacing:"-0.03em", marginBottom:"0.4rem",
                background:"linear-gradient(135deg,#fff 0%,#a5b4fc 60%,#818cf8 100%)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              NeuralChat
            </motion.h1>
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
              style={{ color:"#6b6b9a", fontSize:"0.9rem" }}>
              The AI that thinks alongside you
            </motion.p>
          </div>

          {/* Card */}
          <motion.div
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25, duration:0.4 }}
            style={{ background:"rgba(14,14,22,0.9)", backdropFilter:"blur(40px)",
              border:"1px solid rgba(255,255,255,0.08)", borderRadius:"20px",
              padding:"2rem", boxShadow:"0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)" }}
          >
            <AnimatePresence mode="wait">
              {mode === "options" && (
                <motion.div key="options"
                  initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:10 }}
                  style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>

                  <h2 style={{ fontSize:"1.1rem", fontWeight:600, color:"#e0e0ff", marginBottom:"0.25rem" }}>
                    Welcome back
                  </h2>
                  <p style={{ fontSize:"0.82rem", color:"#6b6b9a", marginBottom:"0.5rem" }}>
                    Sign in to continue your AI conversations
                  </p>

                  {/* Email button */}
                  <motion.button whileHover={{ scale:1.01, y:-1 }} whileTap={{ scale:0.98 }}
                    onClick={() => setMode("email")}
                    style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center",
                      gap:"0.625rem", padding:"0.875rem 1.25rem",
                      background:"linear-gradient(135deg,#6366f1,#4f46e5)",
                      border:"1px solid rgba(99,102,241,0.5)", borderRadius:"12px",
                      color:"white", fontSize:"0.9rem", fontWeight:600, cursor:"pointer",
                      boxShadow:"0 4px 20px rgba(99,102,241,0.35)", transition:"box-shadow 0.2s" }}>
                    <Mail size={16} />
                    Sign in with Email
                  </motion.button>

                  {/* Demo hint */}
                  <div style={{ padding:"0.875rem", background:"rgba(99,102,241,0.08)",
                    border:"1px solid rgba(99,102,241,0.15)", borderRadius:"12px" }}>
                    <p style={{ fontSize:"0.78rem", color:"#9090b8", marginBottom:"0.375rem", fontWeight:500 }}>
                      🚀 Try the demo
                    </p>
                    <div style={{ display:"flex", flexDirection:"column", gap:"0.2rem" }}>
                      <code style={{ fontSize:"0.78rem", color:"#a5b4fc", background:"rgba(99,102,241,0.1)",
                        padding:"0.2rem 0.5rem", borderRadius:"6px", display:"inline-block" }}>
                        demo@neuralchat.ai
                      </code>
                      <code style={{ fontSize:"0.78rem", color:"#a5b4fc", background:"rgba(99,102,241,0.1)",
                        padding:"0.2rem 0.5rem", borderRadius:"6px", display:"inline-block" }}>
                        Demo1234!
                      </code>
                    </div>
                  </div>

                  {/* Features */}
                  <div style={{ display:"flex", gap:"0.5rem", marginTop:"0.25rem" }}>
                    {FEATURES.map(f => (
                      <div key={f.label} style={{ flex:1, padding:"0.625rem", background:"rgba(255,255,255,0.02)",
                        border:"1px solid rgba(255,255,255,0.05)", borderRadius:"10px", textAlign:"center" }}>
                        <f.icon size={14} style={{ margin:"0 auto 0.25rem", color:"#6366f1" }} />
                        <p style={{ fontSize:"0.65rem", color:"#5a5a7a", lineHeight:1.3 }}>{f.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {mode === "email" && (
                <motion.form key="email"
                  initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }}
                  onSubmit={handleSubmit(handleEmail)}
                  style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>

                  <button type="button" onClick={() => { setMode("options"); setError(""); }}
                    style={{ display:"flex", alignItems:"center", gap:"0.375rem", background:"none", border:"none",
                      color:"#6b6b9a", fontSize:"0.8rem", cursor:"pointer", padding:"0", width:"fit-content",
                      marginBottom:"0.25rem" }}>
                    <ArrowLeft size={12} /> Back
                  </button>

                  <div>
                    <h2 style={{ fontSize:"1.1rem", fontWeight:600, color:"#e0e0ff" }}>Sign in</h2>
                    <p style={{ fontSize:"0.82rem", color:"#6b6b9a", marginTop:"0.25rem" }}>
                      Enter your credentials to continue
                    </p>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                      style={{ padding:"0.75rem 1rem", background:"rgba(239,68,68,0.1)",
                        border:"1px solid rgba(239,68,68,0.2)", borderRadius:"10px",
                        fontSize:"0.82rem", color:"#fca5a5" }}>
                      {error}
                    </motion.div>
                  )}

                  <div style={{ display:"flex", flexDirection:"column", gap:"0.375rem" }}>
                    <label style={{ fontSize:"0.75rem", fontWeight:500, color:"#6b6b9a", textTransform:"uppercase", letterSpacing:"0.06em" }}>
                      Email address
                    </label>
                    <input {...register("email")} type="email" placeholder="demo@neuralchat.ai" autoFocus
                      style={{ width:"100%", padding:"0.875rem 1rem",
                        background:"rgba(255,255,255,0.04)", border:`1px solid ${errors.email ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)"}`,
                        borderRadius:"10px", color:"white", fontSize:"0.9rem", outline:"none",
                        transition:"border-color 0.2s", fontFamily:"inherit" }}
                      onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                      onBlur={e => e.target.style.borderColor = errors.email ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)"}
                    />
                    {errors.email && <p style={{ fontSize:"0.75rem", color:"#fca5a5" }}>{errors.email.message}</p>}
                  </div>

                  <div style={{ display:"flex", flexDirection:"column", gap:"0.375rem" }}>
                    <label style={{ fontSize:"0.75rem", fontWeight:500, color:"#6b6b9a", textTransform:"uppercase", letterSpacing:"0.06em" }}>
                      Password
                    </label>
                    <input {...register("password")} type="password" placeholder="••••••••"
                      style={{ width:"100%", padding:"0.875rem 1rem",
                        background:"rgba(255,255,255,0.04)", border:`1px solid ${errors.password ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)"}`,
                        borderRadius:"10px", color:"white", fontSize:"0.9rem", outline:"none",
                        transition:"border-color 0.2s", fontFamily:"inherit" }}
                      onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                      onBlur={e => e.target.style.borderColor = errors.password ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)"}
                    />
                    {errors.password && <p style={{ fontSize:"0.75rem", color:"#fca5a5" }}>{errors.password.message}</p>}
                  </div>

                  <motion.button type="submit" disabled={loading === "email"}
                    whileHover={{ scale:1.01, y:-1 }} whileTap={{ scale:0.98 }}
                    style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center",
                      gap:"0.625rem", padding:"0.9rem",
                      background: loading === "email" ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg,#6366f1,#4f46e5)",
                      border:"none", borderRadius:"12px", color:"white", fontSize:"0.9rem",
                      fontWeight:600, cursor: loading === "email" ? "not-allowed" : "pointer",
                      boxShadow:"0 4px 20px rgba(99,102,241,0.35)", fontFamily:"inherit" }}>
                    {loading === "email"
                      ? <><Loader2 size={16} style={{ animation:"spin 1s linear infinite" }} /> Signing in...</>
                      : <><ArrowRight size={16} /> Sign in</>}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          <p style={{ textAlign:"center", fontSize:"0.75rem", color:"#3a3a5a", marginTop:"1.5rem" }}>
            By signing in you agree to our Terms & Privacy Policy
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        input::placeholder { color: #3a3a5a !important; }
      `}</style>
    </div>
  );
}

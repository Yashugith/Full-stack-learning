
"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSettingsStore } from "@/store/chat";
import { AI_MODELS } from "@/types";
import { Check, Bot, Sliders, Sparkles } from "lucide-react";

const TABS = [
  { id:"model",    label:"AI Model",  icon:Bot },
  { id:"advanced", label:"Advanced",  icon:Sliders },
];

export default function SettingsPage() {
  const [tab,   setTab]   = useState("model");
  const [saved, setSaved] = useState(false);
  const { model, temperature, maxTokens, systemPrompt, streamingEnabled,
    setModel, setTemperature, setMaxTokens, setSystemPrompt, setStreamingEnabled } = useSettingsStore();

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const P: React.CSSProperties = {
    maxWidth:"720px", margin:"0 auto", padding:"2.5rem 2rem",
    fontFamily:"Inter,system-ui,sans-serif",
    minHeight:"100%", background:"#050508"
  };

  return (
    <div style={P}>
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>

        {/* Header */}
        <div style={{marginBottom:"2rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.375rem"}}>
            <div style={{width:"32px",height:"32px",borderRadius:"10px",
              background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 0 16px rgba(99,102,241,0.4)"}}>
              <Sparkles size={16} color="white" />
            </div>
            <h1 style={{fontSize:"1.4rem",fontWeight:700,letterSpacing:"-0.02em",
              background:"linear-gradient(135deg,#fff,#a5b4fc)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              Settings
            </h1>
          </div>
          <p style={{fontSize:"0.82rem",color:"#4a4a6a",marginLeft:"44px"}}>
            Customize your NeuralChat AI experience
          </p>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:"4px",background:"rgba(14,14,22,0.9)",
          padding:"4px",borderRadius:"14px",border:"1px solid rgba(255,255,255,0.05)",
          marginBottom:"1.75rem",width:"fit-content"}}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{display:"flex",alignItems:"center",gap:"0.4rem",
                padding:"0.55rem 1.1rem",borderRadius:"10px",
                fontSize:"0.82rem",fontWeight:500,cursor:"pointer",
                fontFamily:"inherit",border:"none",transition:"all 0.2s",
                background: tab===t.id ? "rgba(99,102,241,0.2)" : "transparent",
                color: tab===t.id ? "#a5b4fc" : "#4a4a6a",
                boxShadow: tab===t.id ? "0 0 20px rgba(99,102,241,0.15)" : "none"}}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div key={tab} initial={{opacity:0,x:8}} animate={{opacity:1,x:0}} transition={{duration:0.18}}>

          {tab === "model" && (
            <div style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>

              {/* Model selector */}
              <div style={{padding:"1.5rem",background:"rgba(14,14,22,0.9)",
                border:"1px solid rgba(255,255,255,0.06)",borderRadius:"18px"}}>
                <h2 style={{fontSize:"0.85rem",fontWeight:600,color:"#8080b8",
                  textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"1rem"}}>
                  Choose AI Model
                </h2>
                <div style={{display:"flex",flexDirection:"column",gap:"0.625rem"}}>
                  {AI_MODELS.map(m => (
                    <button key={m.id} onClick={() => setModel(m.id)}
                      style={{display:"flex",alignItems:"center",gap:"1rem",padding:"1rem 1.1rem",
                        borderRadius:"14px",border: model===m.id
                          ? "1px solid rgba(99,102,241,0.4)"
                          : "1px solid rgba(255,255,255,0.05)",
                        background: model===m.id ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)",
                        cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all 0.2s"}}>
                      <div style={{width:"10px",height:"10px",borderRadius:"50%",flexShrink:0,
                        background: model===m.id ? "#6366f1" : "rgba(255,255,255,0.1)",
                        boxShadow: model===m.id ? "0 0 8px rgba(99,102,241,0.6)" : "none",
                        transition:"all 0.2s"}} />
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"3px"}}>
                          <span style={{fontSize:"0.9rem",fontWeight:600,
                            color: model===m.id ? "#c7d2fe" : "#9090b8"}}>{m.name}</span>
                          <span style={{fontSize:"0.68rem",color:"#4a4a6a",
                            background:"rgba(255,255,255,0.05)",padding:"2px 8px",borderRadius:"6px"}}>
                            {(m.contextLength/1000).toFixed(0)}k tokens
                          </span>
                        </div>
                        <p style={{fontSize:"0.78rem",color:"#4a4a6a"}}>{m.description}</p>
                      </div>
                      {model===m.id && <Check size={16} style={{color:"#6366f1",flexShrink:0}} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* System prompt */}
              <div style={{padding:"1.5rem",background:"rgba(14,14,22,0.9)",
                border:"1px solid rgba(255,255,255,0.06)",borderRadius:"18px"}}>
                <h2 style={{fontSize:"0.85rem",fontWeight:600,color:"#8080b8",
                  textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"0.375rem"}}>
                  System Prompt
                </h2>
                <p style={{fontSize:"0.78rem",color:"#4a4a6a",marginBottom:"0.875rem"}}>
                  Give the AI a custom personality or set of instructions
                </p>
                <textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)}
                  placeholder="You are a helpful expert assistant who gives clear, concise answers..."
                  rows={4}
                  style={{width:"100%",padding:"0.875rem 1rem",
                    background:"rgba(255,255,255,0.03)",
                    border:"1px solid rgba(255,255,255,0.07)",borderRadius:"12px",
                    color:"#c0c0e0",fontSize:"0.875rem",outline:"none",
                    resize:"none",fontFamily:"inherit",lineHeight:1.6,
                    boxSizing:"border-box",transition:"border-color 0.2s"}}
                  onFocus={e => e.target.style.borderColor="rgba(99,102,241,0.4)"}
                  onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.07)"} />
              </div>
            </div>
          )}

          {tab === "advanced" && (
            <div style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>
              <div style={{padding:"1.5rem",background:"rgba(14,14,22,0.9)",
                border:"1px solid rgba(255,255,255,0.06)",borderRadius:"18px"}}>

                {/* Temperature */}
                <div style={{marginBottom:"2rem"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.375rem"}}>
                    <h3 style={{fontSize:"0.9rem",fontWeight:600,color:"#c0c0e0"}}>Temperature</h3>
                    <span style={{fontSize:"0.9rem",fontWeight:700,color:"#6366f1",
                      background:"rgba(99,102,241,0.1)",padding:"2px 10px",borderRadius:"8px",
                      fontFamily:"monospace"}}>{temperature.toFixed(1)}</span>
                  </div>
                  <p style={{fontSize:"0.78rem",color:"#4a4a6a",marginBottom:"0.875rem"}}>
                    Lower = more precise and deterministic. Higher = more creative and varied.
                  </p>
                  <input type="range" min="0" max="2" step="0.1" value={temperature}
                    onChange={e => setTemperature(parseFloat(e.target.value))}
                    style={{width:"100%",accentColor:"#6366f1",cursor:"pointer"}} />
                  <div style={{display:"flex",justifyContent:"space-between",
                    fontSize:"0.72rem",color:"#3a3a5a",marginTop:"6px"}}>
                    <span>🎯 Precise</span><span>⚖️ Balanced</span><span>🎨 Creative</span>
                  </div>
                </div>

                {/* Max tokens */}
                <div style={{marginBottom:"2rem"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.375rem"}}>
                    <h3 style={{fontSize:"0.9rem",fontWeight:600,color:"#c0c0e0"}}>Max Tokens</h3>
                    <span style={{fontSize:"0.9rem",fontWeight:700,color:"#8b5cf6",
                      background:"rgba(139,92,246,0.1)",padding:"2px 10px",borderRadius:"8px",
                      fontFamily:"monospace"}}>{maxTokens.toLocaleString()}</span>
                  </div>
                  <p style={{fontSize:"0.78rem",color:"#4a4a6a",marginBottom:"0.875rem"}}>
                    Maximum length of AI responses (1 token ≈ 4 characters)
                  </p>
                  <input type="range" min="256" max="4096" step="256" value={maxTokens}
                    onChange={e => setMaxTokens(parseInt(e.target.value))}
                    style={{width:"100%",accentColor:"#8b5cf6",cursor:"pointer"}} />
                </div>

                {/* Streaming toggle */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"1rem",background:"rgba(255,255,255,0.02)",
                  border:"1px solid rgba(255,255,255,0.05)",borderRadius:"12px"}}>
                  <div>
                    <p style={{fontSize:"0.875rem",fontWeight:500,color:"#c0c0e0",marginBottom:"3px"}}>
                      Streaming responses
                    </p>
                    <p style={{fontSize:"0.75rem",color:"#4a4a6a"}}>
                      See AI responses appear in real-time as they generate
                    </p>
                  </div>
                  <button onClick={() => setStreamingEnabled(!streamingEnabled)}
                    style={{width:"44px",height:"24px",borderRadius:"12px",
                      background: streamingEnabled ? "#6366f1" : "rgba(255,255,255,0.1)",
                      border:"none",cursor:"pointer",position:"relative",transition:"background 0.25s",
                      flexShrink:0}}>
                    <div style={{width:"18px",height:"18px",borderRadius:"50%",background:"white",
                      position:"absolute",top:"3px",
                      left: streamingEnabled ? "23px" : "3px",
                      transition:"left 0.25s cubic-bezier(0.16,1,0.3,1)",
                      boxShadow:"0 1px 4px rgba(0,0,0,0.4)"}} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Save */}
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:"2rem",
          paddingTop:"1.25rem",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}} onClick={save}
            style={{display:"flex",alignItems:"center",gap:"0.5rem",
              padding:"0.75rem 2rem",borderRadius:"12px",border:"none",
              cursor:"pointer",fontSize:"0.875rem",fontWeight:600,fontFamily:"inherit",
              transition:"all 0.25s",
              background: saved ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#6366f1,#4f46e5)",
              color:"white",
              boxShadow: saved ? "0 4px 15px rgba(16,185,129,0.35)" : "0 4px 15px rgba(99,102,241,0.35)"}}>
            {saved ? <><Check size={15}/> Saved!</> : "Save changes"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

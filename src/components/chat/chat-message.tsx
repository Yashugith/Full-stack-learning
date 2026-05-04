"use client";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, User, Sparkles, AlertTriangle } from "lucide-react";
import { useState } from "react";
import type { ChatMessage } from "@/types";

export function ChatMessageItem({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity:0, y:10 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.25, ease:[0.16,1,0.3,1] }}
      style={{ display:"flex", gap:"0.875rem",
        flexDirection: isUser ? "row-reverse" : "row",
        fontFamily:"'Inter',system-ui,sans-serif" }}
    >
      {/* Avatar */}
      <div style={{ width:"32px", height:"32px", borderRadius:"50%", flexShrink:0, marginTop:"2px",
        display:"flex", alignItems:"center", justifyContent:"center",
        background: isUser
          ? "linear-gradient(135deg,#6366f1,#4f46e5)"
          : "rgba(99,102,241,0.1)",
        border: isUser ? "none" : "1px solid rgba(99,102,241,0.2)",
        boxShadow: isUser ? "0 2px 12px rgba(99,102,241,0.35)" : "none" }}>
        {isUser
          ? <User size={14} style={{ color:"white" }} />
          : <Sparkles size={14} style={{ color:"#6366f1" }} />}
      </div>

      {/* Content */}
      <div style={{ maxWidth:"82%", position:"relative" }} className="group">
        <div style={{
          padding: isUser ? "0.75rem 1.1rem" : "1rem 1.25rem",
          borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
          background: isUser
            ? "linear-gradient(135deg, rgba(99,102,241,0.9), rgba(79,70,229,0.85))"
            : "rgba(18,18,30,0.9)",
          border: isUser ? "none" : "1px solid rgba(255,255,255,0.07)",
          boxShadow: isUser
            ? "0 4px 20px rgba(99,102,241,0.25)"
            : "0 2px 12px rgba(0,0,0,0.3)"
        }}>
          {message.error ? (
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem",
              color:"#fca5a5", fontSize:"0.85rem" }}>
              <AlertTriangle size={14} />
              {message.content || "Something went wrong. Please try again."}
            </div>
          ) : isUser ? (
            <p style={{ fontSize:"0.875rem", lineHeight:1.65, color:"white",
              whiteSpace:"pre-wrap", margin:0 }}>{message.content}</p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children }) {
                    const match = /language-(\w+)/.exec(className ?? "");
                    const lang  = match?.[1] ?? "";
                    const code  = String(children).replace(/\n$/,"");
                    if (match) return <CodeBlock language={lang}>{code}</CodeBlock>;
                    return (
                      <code style={{ background:"rgba(99,102,241,0.12)", color:"#a5b4fc",
                        padding:"0.15rem 0.45rem", borderRadius:"5px", fontSize:"0.82rem",
                        fontFamily:"monospace", border:"1px solid rgba(99,102,241,0.2)" }}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
              {message.isStreaming && (
                <span style={{ display:"inline-block", width:"2px", height:"16px",
                  background:"#6366f1", borderRadius:"1px", marginLeft:"2px",
                  verticalAlign:"middle", animation:"cursor-blink 1s ease-in-out infinite" }} />
              )}
            </div>
          )}
        </div>

        {/* Copy */}
        {!isUser && message.content && !message.isStreaming && (
          <CopyButton content={message.content} />
        )}
      </div>
    </motion.div>
  );
}

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ position:"absolute", bottom:"-22px", left:"4px",
        display:"flex", alignItems:"center", gap:"4px", fontSize:"0.72rem",
        color:"#3a3a5a", background:"none", border:"none", cursor:"pointer",
        opacity:0, transition:"opacity 0.2s", fontFamily:"inherit" }}
      className="copy-btn"
      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color="#6366f1"}
      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color="#3a3a5a"}
    >
      {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
    </button>
  );
}

function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ margin:"0.75rem 0", borderRadius:"12px", overflow:"hidden",
      border:"1px solid rgba(255,255,255,0.08)",
      boxShadow:"0 4px 20px rgba(0,0,0,0.4)" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0.5rem 1rem", background:"rgba(15,15,25,0.9)",
        borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ fontSize:"0.72rem", color:"#4a4a6a", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.06em" }}>
          {language || "code"}
        </span>
        <button onClick={async () => { await navigator.clipboard.writeText(children); setCopied(true); setTimeout(() => setCopied(false),2000); }}
          style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"0.72rem",
            color: copied ? "#22c55e" : "#4a4a6a", background:"none", border:"none",
            cursor:"pointer", fontFamily:"inherit", transition:"color 0.2s" }}>
          {copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
        </button>
      </div>
      <SyntaxHighlighter style={vscDarkPlus} language={language} PreTag="div"
        showLineNumbers={children.split("\n").length > 5}
        customStyle={{ margin:0, fontSize:"0.8rem", background:"#0d0d1a",
          padding:"1rem" }}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

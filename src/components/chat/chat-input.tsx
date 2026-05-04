"use client";
import { useRef, KeyboardEvent, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Square, Sparkles } from "lucide-react";
import { useChatStore } from "@/store/chat";

interface Props {
  onSend: (message: string) => void;
  isStreaming?: boolean;
  onStop?: () => void;
}

export function ChatInput({ onSend, isStreaming, onStop }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { inputValue, setInputValue } = useChatStore();

  const adjustHeight = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  };

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isStreaming) return;
    const msg = inputValue.trim();
    setInputValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    onSend(msg);
  }, [inputValue, isStreaming, onSend, setInputValue]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const canSend = inputValue.trim().length > 0;

  return (
    <div style={{
      display:"flex", alignItems:"flex-end", gap:"0.625rem",
      padding:"0.875rem 1rem",
      background:"rgba(12,12,20,0.95)",
      backdropFilter:"blur(20px)",
      border:"1px solid rgba(255,255,255,0.08)",
      borderRadius:"16px",
      boxShadow:"0 4px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.05)",
      transition:"border-color 0.2s, box-shadow 0.2s",
      fontFamily:"'Inter',system-ui,sans-serif"
    }}
    onFocusCapture={e => {
      const el = e.currentTarget as HTMLDivElement;
      el.style.borderColor = "rgba(99,102,241,0.3)";
      el.style.boxShadow = "0 4px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1), 0 0 20px rgba(99,102,241,0.05)";
    }}
    onBlurCapture={e => {
      const el = e.currentTarget as HTMLDivElement;
      el.style.borderColor = "rgba(255,255,255,0.08)";
      el.style.boxShadow = "0 4px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.05)";
    }}>

      {/* AI indicator */}
      <div style={{ padding:"6px", flexShrink:0, marginBottom:"1px" }}>
        <div style={{ width:"24px", height:"24px", borderRadius:"8px",
          background: isStreaming ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(99,102,241,0.1)",
          border:"1px solid rgba(99,102,241,0.2)",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all 0.3s",
          boxShadow: isStreaming ? "0 0 12px rgba(99,102,241,0.5)" : "none" }}>
          <Sparkles size={12} style={{ color: isStreaming ? "white" : "#6366f1",
            animation: isStreaming ? "spin 2s linear infinite" : "none" }} />
        </div>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={e => { setInputValue(e.target.value); adjustHeight(); }}
        onKeyDown={handleKeyDown}
        placeholder={isStreaming ? "AI is generating a response..." : "Ask NeuralChat anything... (Enter to send)"}
        disabled={isStreaming}
        rows={1}
        style={{ flex:1, background:"transparent", border:"none", outline:"none",
          resize:"none", fontSize:"0.9rem", lineHeight:1.6, color:"#e0e0ff",
          maxHeight:"200px", overflowY:"auto", fontFamily:"inherit",
          cursor: isStreaming ? "not-allowed" : "text" }}
      />

      {/* Send / Stop */}
      <motion.button
        whileHover={{ scale: (isStreaming || canSend) ? 1.05 : 1 }}
        whileTap={{ scale: (isStreaming || canSend) ? 0.92 : 1 }}
        onClick={isStreaming ? onStop : handleSend}
        disabled={!isStreaming && !canSend}
        style={{ padding:"8px", borderRadius:"10px", border:"none",
          cursor: (isStreaming || canSend) ? "pointer" : "not-allowed",
          display:"flex", alignItems:"center", justifyContent:"center",
          flexShrink:0, transition:"all 0.2s",
          background: isStreaming
            ? "rgba(239,68,68,0.9)"
            : canSend
              ? "linear-gradient(135deg,#6366f1,#4f46e5)"
              : "rgba(255,255,255,0.05)",
          boxShadow: isStreaming
            ? "0 2px 12px rgba(239,68,68,0.35)"
            : canSend
              ? "0 2px 12px rgba(99,102,241,0.4)"
              : "none" }}>
        {isStreaming
          ? <Square size={14} style={{ color:"white", fill:"white" }} />
          : <Send size={14} style={{ color: canSend ? "white" : "#3a3a5a" }} />}
      </motion.button>

      <style>{`
        textarea::placeholder { color: #3a3a5a !important; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .group:hover .copy-btn { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

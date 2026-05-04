"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useChatStore, useSettingsStore } from "@/store/chat";
import { ChatMessageItem } from "./chat-message";
import { ChatInput } from "./chat-input";
import { randomUUID } from "@/utils/uuid";
import type { ChatMessage } from "@/types";

interface Props {
  conversationId?: string;
  initialMessages?: ChatMessage[];
}

const STARTERS = [
  { icon:"⚡", label:"Explain quantum computing simply", color:"rgba(99,102,241,0.15)", border:"rgba(99,102,241,0.25)" },
  { icon:"🐍", label:"Write a Python data analysis script", color:"rgba(34,197,94,0.1)", border:"rgba(34,197,94,0.2)" },
  { icon:"💡", label:"Brainstorm startup ideas for 2025", color:"rgba(234,179,8,0.1)", border:"rgba(234,179,8,0.2)" },
  { icon:"🔧", label:"Help me debug my code", color:"rgba(239,68,68,0.1)", border:"rgba(239,68,68,0.2)" },
  { icon:"✍️", label:"Write a professional cover letter", color:"rgba(168,85,247,0.1)", border:"rgba(168,85,247,0.2)" },
  { icon:"📊", label:"Analyze and explain this data", color:"rgba(6,182,212,0.1)", border:"rgba(6,182,212,0.2)" },
];

export function ChatInterface({ conversationId, initialMessages }: Props) {
  const router    = useRouter();
  const qc        = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef  = useRef<AbortController|null>(null);

  const [isStreaming, setIsStreaming]   = useState(false);
  const [activeConvId, setActiveConvId] = useState(conversationId);

  const { messagesByConversation, addMessage, updateMessage, appendToMessage,
          setMessages, setStreamingMessageId } = useChatStore();
  const { model, temperature, maxTokens, systemPrompt } = useSettingsStore();

  const messages = activeConvId ? (messagesByConversation[activeConvId] ?? []) : [];

  useEffect(() => {
    if (initialMessages && activeConvId && messages.length === 0) {
      setMessages(activeConvId, initialMessages);
    }
  }, [initialMessages, activeConvId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages.length, isStreaming]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const userMsgId = randomUUID();
    const asstMsgId = randomUUID();
    const tempConvId = activeConvId ?? `temp-${randomUUID()}`;

    if (!activeConvId) setMessages(tempConvId, []);

    addMessage(tempConvId, { id:userMsgId, role:"user", content, createdAt:new Date() });
    addMessage(tempConvId, { id:asstMsgId, role:"assistant", content:"", createdAt:new Date(), isStreaming:true });
    setStreamingMessageId(asstMsgId);
    setIsStreaming(true);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ conversationId:activeConvId, message:content, model, temperature, maxTokens, systemPrompt }),
        signal: abortRef.current.signal
      });

      if (!res.ok || !res.body) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Stream failed");
      }

      const reader = res.body.getReader();
      const dec    = new TextDecoder();
      let   buf    = "";
      let   realConvId = tempConvId;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream:true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.conversationId && realConvId !== data.conversationId) {
              realConvId = data.conversationId;
              setActiveConvId(realConvId);
              setMessages(realConvId, [
                { id:userMsgId, role:"user",      content, createdAt:new Date() },
                { id:asstMsgId, role:"assistant", content:"", createdAt:new Date(), isStreaming:true }
              ]);
              if (!activeConvId) router.replace(`/chat/${realConvId}`, { scroll:false });
            }
            if (data.content) appendToMessage(realConvId, asstMsgId, data.content);
            if (data.done)    updateMessage(realConvId, asstMsgId, { isStreaming:false });
          } catch { /* ignore parse errors */ }
        }
      }
      qc.invalidateQueries({ queryKey:["conversations"] });
    } catch (err: unknown) {
      const isAbort = (err as Error).name === "AbortError";
      if (!isAbort) {
        const msg = (err as Error).message || "Something went wrong. Check your OpenAI API key and credits.";
        updateMessage(tempConvId, asstMsgId, { content:msg, isStreaming:false, error:true });
      } else {
        updateMessage(tempConvId, asstMsgId, { isStreaming:false });
      }
    } finally {
      setIsStreaming(false);
      setStreamingMessageId(null);
    }
  }, [activeConvId, isStreaming, model, temperature, maxTokens, systemPrompt]);

  const stopStreaming = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setStreamingMessageId(null);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%",
      fontFamily:"'Inter',system-ui,sans-serif", background:"#050508" }}>

      {/* Messages area */}
      <div style={{ flex:1, overflowY:"auto", position:"relative" }}>
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
            style={{ display:"flex", flexDirection:"column", alignItems:"center",
              justifyContent:"center", minHeight:"100%", padding:"3rem 1.5rem", maxWidth:"680px", margin:"0 auto" }}
          >
            {/* Hero */}
            <motion.div
              initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
              transition={{ delay:0.1, duration:0.5, ease:[0.16,1,0.3,1] }}
              style={{ width:"72px", height:"72px", borderRadius:"22px", marginBottom:"1.5rem",
                background:"linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 0 50px rgba(99,102,241,0.4), 0 0 100px rgba(99,102,241,0.15)",
                fontSize:"2rem" }}>
              ✨
            </motion.div>

            <motion.h1
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
              style={{ fontSize:"2rem", fontWeight:700, letterSpacing:"-0.03em",
                textAlign:"center", marginBottom:"0.75rem",
                background:"linear-gradient(135deg,#fff 0%,#a5b4fc 50%,#818cf8 100%)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              What can I help with?
            </motion.h1>

            <motion.p
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
              style={{ color:"#5a5a7a", textAlign:"center", fontSize:"0.95rem",
                maxWidth:"420px", lineHeight:1.6, marginBottom:"2.5rem" }}>
              Ask me anything — I can write code, analyze data, explain concepts, draft content and much more.
            </motion.p>

            {/* Starter prompts */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"0.625rem",
              width:"100%", maxWidth:"580px" }}>
              {STARTERS.map((p, i) => (
                <motion.button key={p.label}
                  initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.3 + i * 0.07, ease:[0.16,1,0.3,1] }}
                  whileHover={{ scale:1.02, y:-2 }} whileTap={{ scale:0.97 }}
                  onClick={() => sendMessage(p.label)}
                  style={{ display:"flex", alignItems:"flex-start", gap:"0.625rem",
                    padding:"0.875rem 1rem", borderRadius:"14px", textAlign:"left",
                    background:p.color, border:`1px solid ${p.border}`,
                    cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s",
                    backdropFilter:"blur(10px)" }}>
                  <span style={{ fontSize:"1.1rem", flexShrink:0, marginTop:"1px" }}>{p.icon}</span>
                  <span style={{ fontSize:"0.82rem", color:"#c0c0e0", fontWeight:500, lineHeight:1.4 }}>{p.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div style={{ maxWidth:"760px", margin:"0 auto", padding:"2rem 1.5rem 1rem" }}>
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <div key={msg.id} style={{ marginBottom:"1.75rem" }}>
                  <ChatMessageItem message={msg} />
                </div>
              ))}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div style={{ flexShrink:0, padding:"1rem 1.5rem 1.25rem",
        background:"linear-gradient(to top, rgba(5,5,8,1) 70%, transparent)",
        borderTop:"1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth:"760px", margin:"0 auto" }}>
          <ChatInput onSend={sendMessage} isStreaming={isStreaming} onStop={stopStreaming} />
          <p style={{ textAlign:"center", fontSize:"0.72rem", color:"#2a2a4a",
            marginTop:"0.625rem", letterSpacing:"0.01em" }}>
            NeuralChat may produce inaccurate info. Verify important facts. ·{" "}
            <span style={{ color:"#3a3a6a" }}>Powered by GPT-4o</span>
          </p>
        </div>
      </div>
    </div>
  );
}

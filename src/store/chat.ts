"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage } from "@/types";

interface ChatStore {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;

  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;

  messagesByConversation: Record<string, ChatMessage[]>;
  setMessages:   (convId: string, msgs: ChatMessage[]) => void;
  addMessage:    (convId: string, msg: ChatMessage) => void;
  updateMessage: (convId: string, id: string, patch: Partial<ChatMessage>) => void;
  appendToMessage: (convId: string, id: string, content: string) => void;

  streamingMessageId: string | null;
  setStreamingMessageId: (id: string | null) => void;

  inputValue: string;
  setInputValue: (v: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      setSidebarOpen: v => set({ sidebarOpen: v }),

      activeConversationId: null,
      setActiveConversationId: id => set({ activeConversationId: id }),

      messagesByConversation: {},
      setMessages: (convId, msgs) =>
        set(s => ({ messagesByConversation: { ...s.messagesByConversation, [convId]: msgs } })),
      addMessage: (convId, msg) =>
        set(s => ({ messagesByConversation: { ...s.messagesByConversation, [convId]: [...(s.messagesByConversation[convId] ?? []), msg] } })),
      updateMessage: (convId, id, patch) =>
        set(s => ({ messagesByConversation: { ...s.messagesByConversation, [convId]: (s.messagesByConversation[convId] ?? []).map(m => m.id === id ? { ...m, ...patch } : m) } })),
      appendToMessage: (convId, id, content) =>
        set(s => ({ messagesByConversation: { ...s.messagesByConversation, [convId]: (s.messagesByConversation[convId] ?? []).map(m => m.id === id ? { ...m, content: m.content + content } : m) } })),

      streamingMessageId: null,
      setStreamingMessageId: id => set({ streamingMessageId: id }),

      inputValue: "",
      setInputValue: v => set({ inputValue: v })
    }),
    { name: "neuralchat", partialize: s => ({ sidebarOpen: s.sidebarOpen, activeConversationId: s.activeConversationId }) }
  )
);

interface SettingsStore {
  model: string; setModel: (v: string) => void;
  temperature: number; setTemperature: (v: number) => void;
  maxTokens: number; setMaxTokens: (v: number) => void;
  systemPrompt: string; setSystemPrompt: (v: string) => void;
  streamingEnabled: boolean; setStreamingEnabled: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    set => ({
      model: "llama-3.3-70b-versatile", setModel: v => set({ model: v }),
      temperature: 0.7,     setTemperature: v => set({ temperature: v }),
      maxTokens: 2048,      setMaxTokens: v => set({ maxTokens: v }),
      systemPrompt: "",     setSystemPrompt: v => set({ systemPrompt: v }),
      streamingEnabled: true, setStreamingEnabled: v => set({ streamingEnabled: v })
    }),
    { name: "neuralchat-settings" }
  )
);

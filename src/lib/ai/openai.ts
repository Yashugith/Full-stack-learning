// Using Groq API (FREE) instead of OpenAI
// Groq provides free access to Llama 3, Mixtral and more
// Sign up at console.groq.com - no credit card needed!

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const AI_MODELS_AVAILABLE = [
  { id: "llama-3.3-70b-versatile",    name: "Llama 3.3 70B",   description: "Most capable free model, great for complex tasks" },
  { id: "llama-3.1-8b-instant",       name: "Llama 3.1 8B",    description: "Fastest responses, great for everyday questions" },
  { id: "mixtral-8x7b-32768",         name: "Mixtral 8x7B",    description: "Excellent for coding and technical tasks" },
  { id: "gemma2-9b-it",               name: "Gemma 2 9B",      description: "Google model, balanced performance" },
];

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface StreamOptions {
  model?: string;
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export async function streamChatCompletion(opts: StreamOptions): Promise<ReadableStream<Uint8Array>> {
  const {
    model = "llama-3.3-70b-versatile",
    messages,
    temperature = 0.7,
    maxTokens = 2048,
    systemPrompt
  } = opts;

  const enc = new TextEncoder();

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: systemPrompt || "You are NeuralChat, a helpful, accurate and friendly AI assistant. Format code in markdown fenced code blocks with the language specified. Be concise but thorough."
        },
        ...messages
      ],
      temperature,
      max_tokens: maxTokens,
      stream: true
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq API error: ${response.status}`);
  }

  return new ReadableStream({
    async start(ctrl) {
      const reader  = response.body!.getReader();
      const decoder = new TextDecoder();
      let   buf     = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === "data: [DONE]") continue;
            if (!trimmed.startsWith("data: ")) continue;

            try {
              const data    = JSON.parse(trimmed.slice(6));
              const content = data.choices?.[0]?.delta?.content ?? "";
              const finish  = data.choices?.[0]?.finish_reason;

              if (content) {
                ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ content, done: false })}\n\n`));
              }
              if (finish === "stop") {
                ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ content: "", done: true })}\n\n`));
              }
            } catch { /* skip bad chunks */ }
          }
        }
      } catch (err) {
        ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ content: "", done: true, error: true })}\n\n`));
      } finally {
        ctrl.close();
      }
    }
  });
}

export async function generateTitle(firstMessage: string): Promise<string> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "Generate a short 3-5 word title for this conversation. Return ONLY the title, no quotes, no punctuation at the end, no extra text." },
          { role: "user",   content: firstMessage }
        ],
        max_tokens: 15,
        temperature: 0.3,
        stream: false
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() ?? "New Chat";
  } catch {
    return "New Chat";
  }
}

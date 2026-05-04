import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/layout/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "NeuralChat", template: "%s | NeuralChat" },
  description: "AI chat assistant powered by GPT-4o"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Providers>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{ className: "!bg-zinc-800 !text-white !border !border-zinc-700" }}
            />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

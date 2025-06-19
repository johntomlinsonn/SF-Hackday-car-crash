'use client';
import Header from "@/components/header"
import Footer from "@/components/footer"
import ChatButton from "@/components/chat-button" // Keeping the floating chat button for now
import Link from "next/link"
import { Conversation } from "@/components/conversation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
// import { ConversationTranscript } from "@/components/conversation-transcript" // removed

export default function LandingPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<any[]>([]);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTranscript() {
      if (!conversationId) return;
      setLoadingTranscript(true);
      setTranscriptError(null);
      try {
        // Dynamically import ElevenLabsClient to avoid SSR issues
        const { ElevenLabsClient } = await import("@elevenlabs/elevenlabs-js");
        const client = new ElevenLabsClient({ apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY });
        const data = await client.conversationalAi.conversations.get(conversationId);
        setTranscript(data.transcript || []);
      } catch (e: any) {
        setTranscriptError('Could not load transcript');
      }
      setLoadingTranscript(false);
    }
    fetchTranscript();
  }, [conversationId]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Been in a Car Accident?
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Don't worry, we're here to help. State Farm's AI assistant, Jake, can guide you through the process, step-by-step.
          </p>
          <div className="mt-10">
            <Link href="/report-claim">
              <Button
                size="lg"
                className="bg-[#E41B23] text-white font-bold text-lg px-12 py-8 rounded-full shadow-lg hover:bg-[#c4161c] transition-transform transform hover:scale-105"
              >
                I'm in a Car Crash
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Or, if you prefer, you can <Link href="/report-claim" className="text-[#E41B23] hover:underline">file a claim manually</Link>.
          </p>
        </div>
      </main>
      <ChatButton />
      <Footer />
    </div>
  )
}

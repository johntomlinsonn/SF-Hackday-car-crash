'use client';

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Conversation } from "@/components/conversation";
import { useState } from "react";

export default function ReportClaimPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Speak with Jake</h1>
        <p className="text-lg text-gray-600 mb-8">Press the microphone to start the conversation.</p>
        <Conversation onConversationId={setConversationId} showHistory={false} />
      </main>
      <Footer />
    </div>
  );
} 
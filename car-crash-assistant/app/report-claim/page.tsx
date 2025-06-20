'use client';

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Conversation } from "@/components/conversation";
import { MockClaim } from "@/components/mock-claim";
import { useState, useEffect } from "react";
import { ClaimData } from '@/lib/types';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

export default function ReportClaimPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversationStatus, setConversationStatus] = useState<'idle' | 'connected' | 'disconnected' | 'error'>('idle');
  const [transcript, setTranscript] = useState<string>("");
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [parsedClaim, setParsedClaim] = useState<ClaimData | null | undefined>(undefined);

  const cerebras = new Cerebras({
    apiKey: process.env.NEXT_PUBLIC_CEREBRAS_API_KEY,
  });

  // Fetch and poll for transcript
  useEffect(() => {
    if (conversationStatus === 'disconnected' && conversationId) {
      setLoadingTranscript(true);
      const pollTranscript = async (retries = 10, delay = 2000) => {
        if (retries === 0) {
          console.error("Failed to fetch transcript after multiple retries.");
          setLoadingTranscript(false);
          setParsedClaim(null); // Set to null on failure
          return;
        }
        try {
          const { ElevenLabsClient } = await import("@elevenlabs/elevenlabs-js");
          const client = new ElevenLabsClient({ apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY });
          const conversation = await client.conversationalAi.conversations.get(conversationId);
          console.log("Full conversation object from ElevenLabs:", conversation);
          const messages = (conversation as any).messages.filter((msg: any) => msg.type === 'transcript').map((msg: any) => msg.message);
          
          if (messages.length > 0) {
            const fullTranscript = messages.join(' ');
            setTranscript(fullTranscript);
            console.log("Transcript fetched:", fullTranscript);
          } else {
            console.log(`Transcript not ready, retrying... (${retries - 1} left)`);
            setTimeout(() => pollTranscript(retries - 1, delay), delay);
          }
        } catch (e) {
          console.error("Error fetching transcript:", e);
          setTimeout(() => pollTranscript(retries - 1, delay), delay);
        }
      };
      pollTranscript();
    }
  }, [conversationStatus, conversationId]);

  // Parse transcript with LLM
  useEffect(() => {
    if (transcript) {
      const parseTranscript = async () => {
        try {
          console.log("Parsing transcript with LLM...");
          const result = await (cerebras as any).llm.create({
            data: {
              prompt: `Parse the following conversation transcript into a structured JSON object for a car insurance claim. The transcript is from an automated AI agent speaking with a person involved in a car crash. Extract all relevant details. The JSON should follow this structure exactly: ${JSON.stringify({
                policyNumber: "string", claimant: { name: "string", contact: "string", address: "string" }, incident: { date: "string", time: "string", location: "string", description: "string", weather: "string", injuries: "string" }, vehicle: { make: "string", model: "string", year: "string", damage: "string", towed: "boolean", towingCompany: "string" }, otherParty: { name: "string", contact: "string", insurance: "string", vehicle: "string" }, witnesses: [{ name: "string", contact: "string" }], policeReport: { filed: "boolean", reportNumber: "string" }
              }, null, 2)}\n\nTranscript:\n${transcript}`
            },
            model: "BTLM-3B-8K-chat",
          });

          if (result && result.choices && result.choices[0]) {
            const content = result.choices[0].text;
            console.log("Raw LLM output:", content);

            // Robust JSON parsing
            const jsonStart = content.indexOf('{');
            const jsonEnd = content.lastIndexOf('}');
            if (jsonStart !== -1 && jsonEnd !== -1) {
                const jsonString = content.substring(jsonStart, jsonEnd + 1);
                const parsed = JSON.parse(jsonString);
                console.log("Parsed claim data:", parsed);
                setParsedClaim(parsed);
            } else {
                console.error("Could not find JSON in LLM response.");
                setParsedClaim(null);
            }
          } else {
            console.error("Invalid response from LLM.");
            setParsedClaim(null);
          }
        } catch (e) {
          console.error("Error parsing transcript:", e);
          setParsedClaim(null);
        } finally {
          setLoadingTranscript(false);
        }
      };
      parseTranscript();
    }
  }, [transcript]);

  const isConversationActive = conversationStatus === 'connected' || conversationStatus === 'idle';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        {isConversationActive || conversationStatus === 'error' ? (
          <>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Speak with Jake</h1>
            <p className="text-lg text-gray-600 mb-8">Press the microphone to start the conversation.</p>
            <Conversation
              onConversationId={setConversationId}
              showHistory={false}
              onStatusChange={setConversationStatus}
            />
            {conversationStatus === 'error' && (
                <p className="mt-4 text-red-600">There was an error with the conversation. Please try again.</p>
            )}
          </>
        ) : parsedClaim === undefined ? (
          <div className="text-xl text-gray-600 animate-pulse">Generating your claim summary...</div>
        ) : parsedClaim === null ? (
            <div className="text-center">
                <p className="text-xl text-red-600">Could not generate claim summary.</p>
                <p className="text-md text-gray-500 mt-2">There was an issue parsing the conversation. Please try again.</p>
            </div>
        ) : (
          <div className="animate-in fade-in duration-500 w-full">
            <MockClaim claimData={parsedClaim} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 
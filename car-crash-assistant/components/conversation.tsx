'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback, useRef, useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { MockClaim } from "@/components/mock-claim";
import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { useRouter } from 'next/navigation';

export function Conversation({
  onConversationId,
  showHistory = true,
  onStatusChange,
}: {
  onConversationId?: (id: string | null) => void;
  showHistory?: boolean;
  onStatusChange?: (status: 'idle' | 'connected' | 'disconnected' | 'error') => void;
}) {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connected' | 'disconnected' | 'error'>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liveUserTranscript, setLiveUserTranscript] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [conversationSummary, setConversationSummary] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.console.log('hello');
    }
  }, []);

  // Fetch and log conversation details each time a message is received
  const fetchAndLogConversationDetails = async (id: string) => {
    try {
      const apiKey = String(process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY);
      const client = new ElevenLabsClient({ apiKey });
      const data = await client.conversationalAi.conversations.get(id);
      console.log('Full conversation details:', data);
      console.log('Transcript:', data.transcript);
      console.log('Status:', data.status);
    } catch (e) {
      console.error('Error fetching conversation details:', e);
    }
  };

  const conversation = useConversation({
    onConnect: () => setStatus('connected'),
    onDisconnect: () => setStatus('disconnected'),
    onMessage: (props: { message: string; source: string }) => {
      // Map "ai" to "agent" for display
      const sender = props.source === "ai" ? "agent" : props.source;
      setMessages((prev) => [...prev, { sender, text: props.message }]);
      setIsSpeaking(conversation.isSpeaking);
      setLiveUserTranscript('');
    },
    onTranscription: (transcription: { text?: string }) => {
      setLiveUserTranscript(transcription?.text || '');
    },
    onError: (error) => setStatus('error'),
  });

  const startConversation = useCallback(async () => {
    setLoading(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const agentId = process.env.NEXT_PUBLIC_AGENT_ID;
      if (!agentId) throw new Error('Agent ID is not set in environment variables.');
      await conversation.startSession({ agentId });
      setStatus('connected');
      const newId = conversation.getId();
      if (typeof newId === 'string') {
        setConversationId(newId);
        if (onConversationId) onConversationId(newId);
      }
    }
    catch {
      setStatus('error');
    }
    setLoading(false);
  }, [conversation, onConversationId]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
    setStatus('disconnected');
    const endId = conversation.getId();
    if (typeof endId === 'string') {
      setConversationId(endId);
      if (onConversationId) onConversationId(endId);
    } else {
      setConversationId(null);
      if (onConversationId) onConversationId(null);
    }
  }, [conversation, onConversationId]);

  const toggleSpeechOutput = () => {
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
    }
    setSpeechEnabled((prev) => !prev);
  };

  // Parse claim after conversation ends
  useEffect(() => {
    async function parseClaim(transcript: string) {
      setParsing(true);
      setParseError(null);
      let content = null;
      try {
        const client = new Cerebras({
          apiKey: process.env.NEXT_PUBLIC_CEREBRAS_API_KEY,
        });
        const prompt = `INSTRUCTIONS: You are an AI insurance assistant helping process car crash claims. Your task is to read the chat transcript at the end of this prompt and extract all relevant information to populate a structured JSON object. This JSON will be used to begin processing the claim.\n\nGuidelines:\n- Only include details that are explicitly stated or strongly implied.\n- If something is not mentioned, omit the field or set it to null if contextually appropriate.\n- Do not make up information.\n- Dates and times must follow ISO 8601 format (YYYY-MM-DDTHH:MM:SS).\n- Use proper U.S. English spelling and capitalization.\n- Output only the completed JSON—no extra commentary.\n\nJSON FORMAT:\n{\n  \"incident_details\": {\n    \"date_time\": \"ISO 8601 format (e.g., 2024-07-29T14:30:00)\",\n    \"location\": \"Street address, city, and country (if known)\",\n    \"description\": \"Brief natural language summary of the incident, including what happened and weather conditions\"\n  },\n  \"your_vehicle\": {\n    \"make_model\": \"Year Make Model\",\n    \"license_plate\": \"License plate number\"\n  },\n  \"other_parties_involved\": [\n    {\n      \"name\": \"Full name of other party\",\n      \"phone\": \"Phone number\",\n      \"insurance\": {\n        \"provider\": \"Insurance company name\",\n        \"policy_number\": \"Policy number\"\n      }\n    }\n  ],\n  \"injuries\": [\n    {\n      \"description\": \"Description of any injuries mentioned\",\n      \"severity\": \"minor | moderate | severe\"\n    }\n  ],\n  \"police_report\": {\n    \"filed\": true | false,\n    \"report_number\": \"Police report number (if available)\",\n    \"officer_name\": \"Name of the responding officer (if available)\"\n  }\n}\n"""${transcript}""":\n[Insert chat transcript here]`;
        const completion = await client.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'llama3.1-8b',
        });
        
        const choices = (completion as any).choices;
        content = choices && choices[0]?.message?.content;

        if (!content) {
          throw new Error("LLM response content is empty.");
        }
        console.log(content)

        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        
        if (jsonStart === -1 || jsonEnd === -1) {
          throw new Error("No JSON object found in the response.");
        }

        const jsonString = content.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(jsonString);
        console.log(parsed)
        setParsedClaim(content);
        
        // Save to sessionStorage and navigate
        sessionStorage.setItem('claimData', JSON.stringify(parsed));
        router.push('/report-claim/summary');
        
      } catch (e: any) {
        setParseError('Failed to parse claim from LLM.');
        setParsedClaim(null);
        console.error("LLM Parsing Error:", e.message);
        if (content) {
          console.error("Original LLM response:", content);
        }
      }
      setParsing(false);
    }

    async function pollForTranscript(id: string, maxAttempts = 2, interval = 1000) {
      const apiKey = String(process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY);
      const client = new ElevenLabsClient({ apiKey });
      for (let attempt = 0; attempt < 1; attempt++) {
        try {
          const data = await client.conversationalAi.conversations.get(id);
          console.log('Full conversation details:', data);
          console.log('Transcript:', data.transcript);
          console.log('Status:', data.status);
          const transcriptText = (data.transcript || [])
            .map((msg: any) => msg.message)
            .filter(Boolean)
            .join('\n');
          if (transcriptText && transcriptText.trim().length > 0) {
            if (typeof window !== 'undefined') {
              window.console.log('Transcript: sho', transcriptText);
            } else {
              console.log('Transcript: ', transcriptText);
            }
            parseClaim(transcriptText);
            return;
          }
        } catch (e) {
          console.error('Error fetching conversation details:', e);
        }
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
      setParseError('Transcript was not available after waiting.');
    }

    if (status === 'disconnected' && conversationId) {
      setTimeout(() => {
        pollForTranscript(conversationId);
      }, 2000);
    }
  }, [status, conversationId]);

  return (
    <Card className="w-full max-w-4xl mx-auto mt-12 mb-8 shadow-lg border-2 border-[#E41B23]/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-[#E41B23] text-white">
        <CardTitle className="text-3xl font-extrabold">State Farm Voice Assistant</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSpeechOutput}
          className="text-white hover:text-white/80"
          aria-label={speechEnabled ? "Disable voice output" : "Enable voice output"}
        >
          {speechEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        {showHistory && (
          <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50 shadow-inner">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                <Mic className="h-12 w-12 mb-4 text-[#E41B23]" />
                <p className="text-lg">Tap the microphone to start talking about your car accident.</p>
                <p className="text-sm mt-2">I can help you with safety steps, reporting claims, and more.</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <span
                    className={`inline-block p-3 rounded-xl max-w-[80%] ${
                      msg.sender === 'user'
                        ? 'bg-[#E41B23] text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    } shadow-sm`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
            {liveUserTranscript && (
              <div className="text-right mb-3">
                <span className="inline-block p-3 rounded-xl max-w-[80%] bg-gray-100 text-gray-600 rounded-br-none italic">
                  {liveUserTranscript}
                </span>
              </div>
            )}
          </div>
        )}
        <div className="flex justify-center mt-6">
          <Button
            onClick={status === 'connected' ? stopConversation : startConversation}
            disabled={loading || isSpeaking}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 ${
              status === 'connected' ? 'bg-[#E41B23] animate-pulse' : 'bg-[#E41B23] hover:bg-[#E41B23]/90'
            }`}
            aria-label={status === 'connected' ? "Stop conversation" : "Start conversation"}
          >
            {loading ? (
              <Loader2 className="h-10 w-10 animate-spin" />
            ) : status === 'connected' ? (
              <MicOff className="h-10 w-10" />
            ) : (
              <Mic className="h-10 w-10" />
            )}
          </Button>
        </div>
        {/* Add the View Claim button */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleViewClaim}
            disabled={!conversationSummary}
            className="bg-[#E41B23] hover:bg-[#E41B23]/90"
          >
            View Pre-filled Claim
          </Button>
        </div>
        {loading && <p className="text-center text-gray-600 mt-4">Connecting...</p>}
        {isSpeaking && <p className="text-center text-gray-600 mt-2">AI is speaking...</p>}
        <p className="text-sm text-gray-600 mt-4 text-center">
          Status:{' '}
          <span
            className={
              status === 'connected'
                ? 'text-green-600'
                : status === 'error'
                ? 'text-red-600'
                : 'text-gray-600'
            }
          >
            {status === 'connected'
              ? isSpeaking
                ? 'Speaking'
                : 'Listening'
              : status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}

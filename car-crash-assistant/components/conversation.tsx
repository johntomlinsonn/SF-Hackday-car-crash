'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback, useRef, useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export function Conversation({ onConversationId }: { onConversationId?: (id: string | null) => void }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'agent'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connected' | 'disconnected' | 'error'>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liveUserTranscript, setLiveUserTranscript] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    onMessage: (message) => {
      if (message.sender === 'user') {
        setMessages((prev) => [...prev, { sender: 'user', text: message.text || '' }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'agent', text: message.text || '' }]);
      }
      setIsSpeaking(conversation.isSpeaking);
      setLiveUserTranscript('');
    },
    onTranscription: (transcription) => {
      setLiveUserTranscript(transcription.text || '');
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
        setConversationId(newId as string);
        if (onConversationId) onConversationId(newId as string);
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
      setConversationId(endId as string);
      if (onConversationId) onConversationId(endId as string);
    } else {
      setConversationId(null);
      if (onConversationId) onConversationId(null);
    }
  }, [conversation, onConversationId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setInput('');
    if (conversation.status === 'connected') {
      await conversation.send({ text: input });
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  useEffect(() => {
    if (status === 'disconnected' && conversationId) {
      setTimeout(() => {
        fetchAndLogConversationDetails(conversationId);
      }, 2000);
    }
  }, [status, conversationId]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 font-montserrat font-sans">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Just got in a Car crash?</h1>
        <p className="text-lg text-gray-600">Talk to our AI car crash agent below</p>
      </div>
      <div className="flex flex-row items-center justify-center w-full max-w-3xl gap-8">
        <div className="flex flex-row items-stretch w-full max-w-3xl">
          <img
            src="https://www.statefarm.com/content/dam/sf-library/en-us/secure/legacy/team-west/cl-table-oval.jpg"
            alt="State Farm Agent"
            className="h-full w-[360px] object-cover"
            style={{ maxHeight: '800px' }}
          />
          <Card className="w-full max-w-sm rounded-xl shadow-lg overflow-hidden font-montserrat font-sans">
            <CardHeader className="bg-[#E41B23] p-6 text-center font-montserrat font-sans">
              <CardTitle className="text-2xl font-bold text-white font-montserrat font-sans">State Farm AI Voice Agent</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 flex flex-col items-center font-montserrat font-sans">
              <div className="flex gap-4 w-full justify-center">
                <Button
                  className="flex-1 py-3 text-lg bg-[#E41B23] text-white hover:bg-[#c4161c] rounded-full shadow-md transition-all duration-200 ease-in-out font-montserrat font-sans"
                  onClick={startConversation}
                  disabled={status === 'connected' || loading}
                >
                  {loading && status !== 'connected' ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    'Start Voice'
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 py-3 text-lg bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200 hover:text-gray-600 rounded-full shadow-sm transition-all duration-200 ease-in-out font-montserrat font-sans"
                  onClick={stopConversation}
                  disabled={status !== 'connected'}
                >
                  Stop
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-4 font-montserrat font-sans">
                Status:{' '}
                <span
                  className={
                    (status === 'connected'
                      ? 'text-green-600'
                      : status === 'error'
                      ? 'text-red-600'
                      : 'text-gray-600') + ' font-montserrat font-sans'
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
        </div>
      </div>
    </div>
  );
}

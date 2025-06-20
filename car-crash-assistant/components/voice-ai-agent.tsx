"use client"

import { useConversation } from "@elevenlabs/react"
import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

export default function VoiceAiAgent() {
  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => console.log("Message:", message),
    onError: (error) => console.error("Error:", error),
  })
  const router = useRouter()
  const [conversationSummary, setConversationSummary] = useState<string | null>(null)

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      const agentId = process.env.NEXT_PUBLIC_AGENT_ID
      if (!agentId) {
        throw new Error("Agent ID is not set in environment variables.")
      }
      await conversation.startSession({
        agentId,
      })
    } catch (error) {
      console.error("Failed to start conversation:", error)
    }
  }, [conversation])

  const stopConversation = useCallback(async () => {
    await conversation.endSession()
  }, [conversation])

  const handleViewClaim = () => {
    if (conversationSummary) {
      router.push(`/claim?summary=${encodeURIComponent(conversationSummary)}`)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button
          onClick={startConversation}
          disabled={conversation.status === "connected"}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Start Conversation
        </button>
        <button
          onClick={stopConversation}
          disabled={conversation.status !== "connected"}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
        >
          Stop Conversation
        </button>
      </div>
      <div className="flex flex-col items-center">
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? "speaking" : "listening"}</p>
      </div>
      <button
        onClick={handleViewClaim}
        disabled={!conversationSummary}
        style={{ marginTop: 24 }}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
      >
        View Pre-filled Claim
      </button>
    </div>
  )
}

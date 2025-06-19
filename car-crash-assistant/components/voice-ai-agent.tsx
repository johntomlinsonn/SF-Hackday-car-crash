"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Volume2, VolumeX } from "lucide-react"

interface Message {
  sender: "user" | "ai"
  text: string
}

export default function VoiceAiAgent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(true) // Toggle for AI voice output
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const speakText = useCallback(
    (text: string) => {
      if (!speechEnabled) return

      const utterance = new window.SpeechSynthesisUtterance(text)
      utterance.lang = "en-US"
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error)
        setIsSpeaking(false)
      }
      window.speechSynthesis.speak(utterance)
    },
    [speechEnabled],
  )

  const handleSendMessage = async () => {
    if (input.trim() === "") return

    const userMessage: Message = { sender: "user", text: input }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const aiMessage: Message = { sender: "ai", text: data.response }
      setMessages((prevMessages) => [...prevMessages, aiMessage])
      speakText(data.response)
    } catch (error) {
      console.error("Error sending message to AI:", error)
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: "Sorry, I am having trouble connecting. Please try again later." },
      ])
      if (speechEnabled) speakText("Sorry, I am having trouble connecting. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleSendMessage()
    }
  }

  const toggleSpeechOutput = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel() // Stop current speech if any
    }
    setSpeechEnabled((prev) => !prev)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-12 mb-8 shadow-lg border-2 border-statefarmRed/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-3xl font-extrabold text-gray-800">State Farm Voice Assistant</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSpeechOutput}
          className="text-gray-600 hover:text-statefarmRed"
          aria-label={speechEnabled ? "Disable voice output" : "Enable voice output"}
        >
          {speechEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50 shadow-inner">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
              <p className="text-lg">Type your question below to start talking about your car accident.</p>
              <p className="text-sm mt-2">I can help you with safety steps, reporting claims, and more.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`mb-3 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block p-3 rounded-xl max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-statefarmRed text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  } shadow-sm`}
                >
                  {msg.text}
                </span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="flex-1 border rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-statefarmRed"
          />
          <Button onClick={handleSendMessage} disabled={loading} className="bg-statefarmRed hover:bg-statefarmRed/90">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        {loading && <p className="text-center text-gray-600 mt-4">Thinking...</p>}
        {isSpeaking && <p className="text-center text-gray-600 mt-2">AI is speaking...</p>}
      </CardContent>
    </Card>
  )
}

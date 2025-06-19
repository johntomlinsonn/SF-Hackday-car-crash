"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, MicOff, Loader2, Volume2, VolumeX } from "lucide-react"
import type SpeechRecognition from "speech-recognition"

interface Message {
  sender: "user" | "ai"
  text: string
}

// Declare SpeechRecognition and SpeechSynthesis globally for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition
    SpeechRecognition: typeof SpeechRecognition
    SpeechSynthesisUtterance: typeof SpeechSynthesisUtterance
  }
}

export default function VoiceAiAgent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isListening, setIsListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(true) // Toggle for AI voice output
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        console.log("Voice recognition started.")
      }

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        console.log("User said:", transcript)
        handleSendMessage(transcript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
        setLoading(false)
        if (event.error === "not-allowed") {
          alert("Microphone access denied. Please allow microphone access in your browser settings.")
        } else if (event.error === "no-speech") {
          // Do nothing, just means no speech was detected
        } else {
          setMessages((prev) => [...prev, { sender: "ai", text: "Sorry, I didn't catch that. Can you please repeat?" }])
          if (speechEnabled) speakText("Sorry, I didn't catch that. Can you please repeat?")
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        console.log("Voice recognition ended.")
      }
    } else {
      console.warn("Web Speech API not supported in this browser.")
      alert("Your browser does not support the Web Speech API. Please use Chrome or Edge for voice features.")
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

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

  const handleSendMessage = async (text: string) => {
    if (text.trim() === "") return

    const userMessage: Message = { sender: "user", text }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: text }),
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

  const toggleListening = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop()
      } else {
        setMessages((prev) => [...prev, { sender: "ai", text: "Listening..." }])
        recognitionRef.current.start()
      }
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
              <Mic className="h-12 w-12 mb-4 text-statefarmRed" />
              <p className="text-lg">Tap the microphone to start talking about your car accident.</p>
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
        <div className="flex justify-center mt-6">
          <Button
            onClick={toggleListening}
            disabled={loading || isSpeaking}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 ${
              isListening ? "bg-statefarmRed animate-pulse" : "bg-statefarmRed hover:bg-statefarmRed/90"
            }`}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            {loading ? (
              <Loader2 className="h-10 w-10 animate-spin" />
            ) : isListening ? (
              <MicOff className="h-10 w-10" />
            ) : (
              <Mic className="h-10 w-10" />
            )}
          </Button>
        </div>
        {loading && <p className="text-center text-gray-600 mt-4">Thinking...</p>}
        {isSpeaking && <p className="text-center text-gray-600 mt-2">AI is speaking...</p>}
      </CardContent>
    </Card>
  )
}

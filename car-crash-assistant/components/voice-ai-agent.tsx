"use client"
import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Loader2 } from "lucide-react"

export default function VoiceAiAgent() {
  const [captions, setCaptions] = useState<{ sender: "user" | "ai"; text: string }[]>([])
  const [isListening, setIsListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const captionsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    captionsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [captions])

  const handleMicClick = () => {
    if (isListening) {
      setIsListening(false)
      setLoading(true)
      setTimeout(() => {
        setCaptions(prev => [
          ...prev,
          { sender: "ai", text: "This is a sample AI response based on your voice input." }
        ])
        setLoading(false)
      }, 1200)
    } else {
      setIsListening(true)
      setCaptions(prev => [
        ...prev,
        { sender: "user", text: "This is a sample user voice input (captioned)." }
      ])
    }
  }

  return (
    <section className="w-full flex justify-center mt-10">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-100 px-0 py-0">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-2xl font-bold text-[#E41B23]">AI Crash Voice Agent</h2>
          <p className="text-gray-600 text-sm mt-1 mb-4">
            Speak to our AI assistant for real-time help after a car accident. Your conversation will appear as captions below.
          </p>
        </div>
        <div className="h-48 overflow-y-auto bg-gray-50 rounded-lg px-6 py-4 mb-2 border mx-4">
          {captions.length === 0 ? (
            <div className="text-gray-400 text-center mt-10">Press the microphone to start talking to the AI Crash Voice Agent.</div>
          ) : (
            captions.map((msg, idx) => (
              <div key={idx} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-[#E41B23] text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))
          )}
          <div ref={captionsEndRef} />
        </div>
        <div className="flex justify-center pb-6">
          <button
            onClick={handleMicClick}
            className={`bg-[#E41B23] hover:bg-[#c4161c] text-white rounded-full w-16 h-16 flex items-center justify-center shadow transition-colors focus:outline-none focus:ring-2 focus:ring-[#E41B23]/50`}
            aria-label={isListening ? "Stop listening" : "Start listening"}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : isListening ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </button>
        </div>
      </div>
    </section>
  )
}

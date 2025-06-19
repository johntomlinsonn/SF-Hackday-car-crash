import Header from "@/components/header"
import Footer from "@/components/footer"
import ChatButton from "@/components/chat-button" // Keeping the floating chat button for now
import Link from "next/link"
import VoiceAiAgent from "@/components/voice-ai-agent" // Import the new voice agent
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link href="#" className="hover:underline">
            Claims
          </Link>
          <span className="mx-2">&gt;</span>
          <Link href="#" className="hover:underline">
            Auto
          </Link>
          <span className="mx-2">&gt;</span>
          <span>How To Handle An Accident</span>
        </nav>

        {/* New Voice AI Agent Section - Made prominent */}
        <section className="mb-12">
          <VoiceAiAgent />
        </section>

        {/* Main Content Section (moved below AI agent) */}
        <section className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            How to handle an auto accident
          </h1>
          <p className="text-lg text-gray-700 mb-12">
            Having an auto accident or dealing with a catastrophe is stressful, yet it's important to try to stay calm
            and focused.
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">What do I do after an accident?</h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">1. Safety first</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
                <li>
                  If the car accident is minor, <span className="font-bold">move vehicles out of traffic</span> to a
                  safe place.
                </li>
                <li>
                  Shift into park, <span className="font-bold">turn off your vehicle</span>, and turn on the hazard
                  lights.
                </li>
                <li>
                  Use cones, warning triangles, or flares for <span className="font-bold">added safety</span>, if you
                  have them.
                </li>
              </ul>
            </div>

            {/* Step 2 (placeholder as content not fully visible) */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">2. Get help</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
                <li>Call 911 if anyone is injured or if there is significant damage.</li>
                <li>Exchange information with the other driver(s): name, contact, insurance, license plate.</li>
                <li>Gather witness contact information if available.</li>
              </ul>
            </div>

            {/* Additional steps can be added here following the pattern */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">3. Document the scene</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
                <li>Take photos of all vehicles involved, damage, road conditions, and any relevant surroundings.</li>
                <li>Note the date, time, and location of the accident.</li>
                <li>Write down a detailed account of what happened while it's fresh in your mind.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">4. Report the claim</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
                <li>Contact State Farm as soon as possible to report the accident.</li>
                <li>You can report a claim online, through the mobile app, or by calling your agent.</li>
                <li>Provide all gathered information and documentation to your claims representative.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Chat Section */}
        <section className="w-full flex justify-center mt-10">
          <div className="mb-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#E41B23] mb-1">Need help with a car crash?</h2>
            <p className="text-gray-600 text-base">Talk to our AI crash agent for help that will take care of all of it.</p>
          </div>
          <Card className="w-full max-w-xl rounded-2xl shadow-lg border border-gray-100">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#E41B23]">AI Crash Chatbot</CardTitle>
              <p className="text-gray-600 text-sm mt-1">Ask questions about what to do after a car accident, claims, and more.</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4 border">
                {messages.length === 0 ? (
                  <div className="text-gray-400 text-center mt-12">Start a conversation with our AI Crash Chatbot.</div>
                ) : (
                  messages.map((msg, idx) => (
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
                <div ref={messagesEndRef} />
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type your question here..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={loading}
                  className="bg-[#E41B23] hover:bg-[#c4161c] text-white"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <ChatButton />
      <Footer />
    </div>
  )
}

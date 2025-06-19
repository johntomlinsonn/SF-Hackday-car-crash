import Header from "@/components/header"
import Footer from "@/components/footer"
import ChatButton from "@/components/chat-button" // Keeping the floating chat button for now
import Link from "next/link"
import VoiceAiAgent from "@/components/voice-ai-agent" // Import the new voice agent

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
      </main>
      <ChatButton />
      <Footer />
    </div>
  )
}

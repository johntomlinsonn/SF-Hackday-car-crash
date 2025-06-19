import Header from "@/components/header";
import Footer from "@/components/footer";
import VoiceAiAgent from "@/components/voice-ai-agent";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7]">
      {/* State Farm style header */}
      <Header />
      <main className="flex flex-col items-center flex-1 w-full px-4 py-8 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#E41B23] mb-6 text-center">How to handle an auto accident</h1>
        <div className="space-y-8 w-full">
          {/* Step 1 */}
          <section className="bg-white rounded-xl shadow p-6 border-l-8 border-[#E41B23]">
            <h2 className="text-xl font-bold text-[#E41B23] mb-2">1. Safety first</h2>
            <ul className="list-disc pl-6 text-gray-800 space-y-1">
              <li>If the car accident is minor, <b>move vehicles out of traffic</b> to a safe place.</li>
              <li>Shift into park, <b>turn off your vehicle</b>, and turn on the hazard lights.</li>
              <li>Use cones, warning triangles, or flares for <b>added safety</b>, if you have them.</li>
            </ul>
          </section>
          {/* Step 2 */}
          <section className="bg-white rounded-xl shadow p-6 border-l-8 border-[#E41B23]">
            <h2 className="text-xl font-bold text-[#E41B23] mb-2">2. Get help</h2>
            <ul className="list-disc pl-6 text-gray-800 space-y-1">
              <li><b>Check for injuries</b>; call an ambulance when in doubt.</li>
              <li><b>Call the police</b>, even if the accident is minor. A police report can be invaluable to the claim process and help establish who's at fault.</li>
            </ul>
          </section>
          {/* Step 3 */}
          <section className="bg-white rounded-xl shadow p-6 border-l-8 border-[#E41B23]">
            <h2 className="text-xl font-bold text-[#E41B23] mb-2">3. Collect information</h2>
            <ul className="list-disc pl-6 text-gray-800 space-y-1">
              <li><b>Gather information</b> from others involved in the accident:
                <ul className="list-disc pl-6">
                  <li>Drivers and passengers: names and contact information.</li>
                  <li>Vehicle descriptions (make, model, year).</li>
                  <li>Driver's license numbers - License plate numbers.</li>
                  <li>Insurance companies and policy numbers.</li>
                  <li>Eyewitnesses: names and contact information.</li>
                  <li>Accident scene location and/or address.</li>
                  <li>Police officer's name and badge number.</li>
                </ul>
              </li>
              <li><b>Take photos</b> of all vehicles involved and the accident scene, if it is safe to do so.</li>
              <li><b>Do not sign</b> any document unless it's for the police or your insurance agent.</li>
              <li>Be polite, but <b>don't tell anyone the accident was your fault</b>, even if you think it was.</li>
            </ul>
          </section>
          {/* Step 4 */}
          <section className="bg-white rounded-xl shadow p-6 border-l-8 border-[#E41B23]">
            <h2 className="text-xl font-bold text-[#E41B23] mb-2">4. File a claim</h2>
            <ul className="list-disc pl-6 text-gray-800 space-y-1">
              <li>You can start the claim process immediately at the scene and add details when things are calmer.</li>
              <li>File a claim online, use our easy State Farm® mobile app, or call us at <b>800-SF-CLAIM (1-800-732-5246)</b>.</li>
              <li>Notify your insurance agent as soon as possible.</li>
            </ul>
          </section>
          {/* Step 5 */}
          <section className="bg-white rounded-xl shadow p-6 border-l-8 border-[#E41B23]">
            <h2 className="text-xl font-bold text-[#E41B23] mb-2">5. Get roadside assistance</h2>
            <ul className="list-disc pl-6 text-gray-800 space-y-1">
              <li>If your vehicle isn't drivable after an accident, learn about roadside assistance and request roadside service from State Farm.</li>
            </ul>
          </section>
        </div>
        {/* AI Voice Agent Section */}
        <div className="w-full mt-12">
          <VoiceAiAgent />
        </div>
      </main>
      <Footer />
    </div>
  );
}

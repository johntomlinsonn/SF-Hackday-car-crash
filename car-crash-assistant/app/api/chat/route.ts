import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    const { text } = await generateText({
      model: openai("gpt-4o"), // Using GPT-4o model
      prompt: `You are a helpful State Farm AI assistant specializing in car crash information. Provide concise and helpful advice based on the user's query about car accidents. If the user asks for something outside of car crash information or State Farm services, politely decline and redirect them to car accident topics.
      
      User query: ${prompt}`,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error generating AI response:", error)
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 })
  }
}

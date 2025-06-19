import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'

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

export async function GET(req: NextRequest) {
  const conversationId = req.nextUrl.searchParams.get('conversationId')
  if (!conversationId) {
    return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 })
  }
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 })
  }
  const client = new ElevenLabsClient({ apiKey })
  try {
    const data = await client.conversationalAi.conversations.get(conversationId)
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch transcript' }, { status: 500 })
  }
}

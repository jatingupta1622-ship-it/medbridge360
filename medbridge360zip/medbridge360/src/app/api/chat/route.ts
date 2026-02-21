import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are MedBridge360 AI Assistant, a helpful medical tourism and healthcare cost advisor.

Your role is to:
- Help users compare hospitals and understand cost breakdowns
- Suggest the best hospitals based on their budget and treatment needs
- Explain medical terms in simple, easy-to-understand language
- Provide guidance on medical tourism (travel for treatment)
- Answer questions about treatment timelines and what to expect
- Help users make informed decisions about their healthcare journey

When discussing costs, always clarify that prices are estimates and may vary based on individual circumstances.
Always recommend users consult with medical professionals for specific medical advice.

Be warm, empathetic, clear, and concise. Use bullet points when listing multiple items.
If asked about a specific hospital or treatment from the MedBridge360 database, be helpful about what information you know.

Remember: You're helping people make one of the most important decisions of their lives - their healthcare.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      // Fallback response when no API key
      const lastMessage = messages[messages.length - 1]?.content || ''
      const fallbackResponse = generateFallbackResponse(lastMessage)
      return NextResponse.json({ message: fallbackResponse })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.slice(-10), // Keep last 10 messages for context
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const message = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.'

    return NextResponse.json({ message })
  } catch (error: unknown) {
    console.error('POST /api/chat error:', error)
    
    // Return fallback when OpenAI fails
    const body = await request.json().catch(() => ({ messages: [] }))
    const lastMessage = body.messages?.[body.messages.length - 1]?.content || ''
    const fallbackResponse = generateFallbackResponse(lastMessage)
    return NextResponse.json({ message: fallbackResponse })
  }
}

function generateFallbackResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase()
  
  if (lower.includes('cheapest') || lower.includes('cheap') || lower.includes('affordable') || lower.includes('budget')) {
    return "Based on our database, AIIMS New Delhi and Narayana Health City offer the most affordable treatment options. Cardiac bypass surgery at AIIMS starts from $3,000, significantly lower than private hospitals. Would you like me to help you compare specific treatments?"
  }
  
  if (lower.includes('cardiac') || lower.includes('heart')) {
    return "For cardiac procedures, we have excellent hospitals available:\n\n• **AIIMS Delhi** - Starting from $3,000 (most affordable)\n• **Narayana Health** - Starting from $5,500\n• **Fortis** - Starting from $7,500\n• **Apollo** - Starting from $8,000\n\nAll hospitals are JCI accredited. Would you like details on any specific hospital?"
  }
  
  if (lower.includes('cancer') || lower.includes('oncology')) {
    return "Cancer treatment costs vary significantly. Here's a quick overview:\n\n• **AIIMS Delhi** - $8,000+ (government subsidized)\n• **Narayana Health** - $11,000+\n• **Medanta** - $12,000+\n• **Apollo** - $15,000+\n\nCosts depend on cancer type, stage, and treatment protocol. I recommend consulting oncologists at 2-3 hospitals for personalized quotes."
  }

  if (lower.includes('knee') || lower.includes('hip') || lower.includes('orthopedic') || lower.includes('joint')) {
    return "For orthopedic procedures:\n\n• **Knee Replacement**: $4,500 - $6,500\n• **Hip Replacement**: $5,000 - $7,500\n• **Spine Surgery**: $8,000 - $14,000\n\nIndia offers world-class orthopedic care at 60-80% less than US/UK prices. Recovery stays typically 7-15 days."
  }
  
  if (lower.includes('timeline') || lower.includes('how long') || lower.includes('duration')) {
    return "Treatment timelines vary by procedure:\n\n• **Minor surgeries**: 5-7 days\n• **Knee/Hip replacement**: 8-12 days\n• **Cardiac bypass**: 12-15 days\n• **Cancer treatment**: 25-60 days\n• **Transplants**: 30-60 days\n\nThis includes pre-op consultations, the procedure, and initial recovery. Full recovery at home may take additional weeks."
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! 👋 I'm MedBridge360's AI Assistant. I can help you:\n\n• Compare hospitals and costs\n• Understand treatment options\n• Find affordable healthcare\n• Explain medical terms\n\nWhat are you looking for today?"
  }
  
  return "Thank you for your question! I'm here to help you navigate healthcare costs and hospital comparisons. You can ask me about:\n\n• Specific treatments and their costs\n• Hospital recommendations by budget\n• Treatment timelines\n• Medical terms explained simply\n\nWhat specific information can I help you with?"
}

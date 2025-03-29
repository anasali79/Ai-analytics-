"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API with the environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function getSuggestions(partialQuery: string): Promise<string[]> {
  try {
    // Use a simpler approach with the Google Generative AI SDK directly
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      You are an AI assistant for a business analytics dashboard. 
      The user has started typing a business query: "${partialQuery}"
      
      Generate 3-5 complete business analytics queries that the user might be trying to ask.
      These should be realistic business questions that would be asked to analyze company data.
      
      Return ONLY the list of suggested queries, one per line, with no additional text, numbering, or formatting.
    `

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Split by newlines and filter out empty lines
    const suggestions = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 5) // Limit to 5 suggestions

    return suggestions
  } catch (error) {
    console.error("Error generating suggestions:", error)
    // Fallback suggestions if the API call fails
    return [
      `${partialQuery} for the last quarter`,
      `${partialQuery} compared to previous year`,
      `${partialQuery} by product category`,
    ]
  }
}


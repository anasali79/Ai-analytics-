"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API with the environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Sample data for visualization
const mockDatasets = {
  sales: [
    { name: "Jan", "Product A": 4000, "Product B": 2400, "Product C": 1800 },
    { name: "Feb", "Product A": 3000, "Product B": 1398, "Product C": 2800 },
    { name: "Mar", "Product A": 2000, "Product B": 9800, "Product C": 2200 },
    { name: "Apr", "Product A": 2780, "Product B": 3908, "Product C": 2000 },
    { name: "May", "Product A": 1890, "Product B": 4800, "Product C": 2181 },
    { name: "Jun", "Product A": 2390, "Product B": 3800, "Product C": 2500 },
  ],
  customers: [
    { name: "18-24", Male: 1200, Female: 1800, Other: 200 },
    { name: "25-34", Male: 5000, Female: 6800, Other: 800 },
    { name: "35-44", Male: 4200, Female: 4800, Other: 600 },
    { name: "45-54", Male: 3800, Female: 3600, Other: 400 },
  ],
  marketing: [
    { name: "Email", value: 4000 },
    { name: "Social", value: 3000 },
    { name: "Content", value: 2000 },
    { name: "PPC", value: 2780 },
  ],
}

export async function processQuery(query: string) {
  try {
    // Use Gemini to analyze the query and generate a response
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      You are an AI assistant for a business analytics dashboard. The user has asked the following business question:
      
      "${query}"
      
      Based on this question, please provide:
      
      1. A detailed summary of the answer (2-3 sentences)
      2. 3-4 key insights related to the question
      3. Determine which dataset would be most appropriate to visualize this data from these options: "sales", "customers", or "marketing"
      4. Determine which chart type would be best to visualize this data: "bar", "line", or "pie"
      
      Format your response as a JSON object with the following structure:
      {
        "summary": "Your summary here",
        "insights": ["Insight 1", "Insight 2", "Insight 3"],
        "dataset": "sales|customers|marketing",
        "chartType": "bar|line|pie"
      }
      
      Return ONLY the JSON object, nothing else. Do not include backticks, markdown formatting, or any other text.
    `

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Clean the response text to ensure it's valid JSON
    const cleanedText = text
      .replace(/```json/g, "") // Remove markdown json code block start
      .replace(/```/g, "") // Remove any markdown code block markers
      .trim() // Remove whitespace

    // Parse the JSON response
    let aiResponse
    try {
      aiResponse = JSON.parse(cleanedText)
    } catch (error) {
      console.error("Error parsing AI response:", error, "Raw response:", cleanedText)
      // Fallback to default response
      aiResponse = {
        summary: "I couldn't generate a proper analysis for your query. Here's some sample data instead.",
        insights: [
          "This is sample data and not based on your specific query.",
          "Try asking a more specific business question.",
          "You can ask about sales, customers, or marketing data.",
        ],
        dataset: "sales",
        chartType: "bar",
      }
    }

    // Ensure all required properties exist
    const validatedResponse = {
      summary: aiResponse.summary || "Analysis of your business query.",
      insights: Array.isArray(aiResponse.insights)
        ? aiResponse.insights
        : [
            "No specific insights were generated.",
            "Try asking a more specific question.",
            "You can ask about sales, customers, or marketing data.",
          ],
      dataset: ["sales", "customers", "marketing"].includes(aiResponse.dataset) ? aiResponse.dataset : "sales",
      chartType: ["bar", "line", "pie"].includes(aiResponse.chartType) ? aiResponse.chartType : "bar",
    }

    // Return the result with the appropriate dataset
    return {
      data: mockDatasets[validatedResponse.dataset],
      summary: validatedResponse.summary,
      insights: validatedResponse.insights,
      chartType: validatedResponse.chartType,
    }
  } catch (error) {
    console.error("Error processing query with AI:", error)

    // Fallback response
    return {
      data: mockDatasets.sales,
      summary: "I couldn't process your query at this time. Here's some sample sales data instead.",
      insights: [
        "This is sample data and not based on your specific query.",
        "Our system might be experiencing issues.",
        "Try again later or rephrase your question.",
      ],
      chartType: "bar",
    }
  }
}


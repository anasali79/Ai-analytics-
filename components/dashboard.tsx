"use client"

import { useQuery } from "@/lib/context/query-context"
import QueryInput from "./query-input"
import QueryHistory from "./query-history"
import ResultsDisplay from "./results-display"
import { Card, CardContent } from "@/components/ui/card"

export default function Dashboard() {
  const { status } = useQuery()

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gen AI Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Ask complex business questions and get instant, data-driven insights
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <QueryInput />
            </CardContent>
          </Card>

          <div className="mt-6">
            <ResultsDisplay />
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Query History</h2>
              <QueryHistory />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


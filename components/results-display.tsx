"use client"

import type React from "react"

import { useQuery } from "@/lib/context/query-context"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle, BarChart, TableIcon } from "lucide-react"
import DataChart from "./data-chart"
import DataTable from "./data-table"

export default function ResultsDisplay() {
  const { status, currentQuery, currentResult, error } = useQuery()

  if (status === "idle" && !currentResult) {
    return null
  }

  if (status === "loading") {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Processing your query</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              Analyzing data and generating insights based on your question...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === "failed") {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Error processing query</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              {error || "We couldn't process your query. Please try again or rephrase your question."}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === "succeeded" && currentResult) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Results</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm italic">"{currentQuery}"</p>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Summary</h3>
            <p className="text-gray-700 dark:text-gray-300">{currentResult.summary}</p>
          </div>

          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="chart" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span>Chart</span>
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <TableIcon className="h-4 w-4" />
                <span>Table</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Insights</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chart" className="mt-0">
              <div className="h-80">
                <DataChart data={currentResult.data} chartType={currentResult.chartType} />
              </div>
            </TabsContent>

            <TabsContent value="table" className="mt-0">
              <DataTable data={currentResult.data} />
            </TabsContent>

            <TabsContent value="insights" className="mt-0">
              <div className="space-y-4">
                {currentResult.insights.map((insight, index) => (
                  <div
                    key={index}
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800"
                  >
                    <p className="text-gray-800 dark:text-gray-200">{insight}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    )
  }

  return null
}

// Sparkles component since it's not in lucide-react by default
function Sparkles(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v5m4-2-1 1m-6 0-1-1" />
      <path d="M12 21v-5m4 2-1-1m-6 0-1 1" />
      <path d="M19 9h-5m2 4-1-1m-6 0-1 1" />
      <path d="M5 9h5m-2 4 1-1m6 0 1 1" />
    </svg>
  )
}


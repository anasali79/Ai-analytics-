"use client"

import { useQuery } from "@/lib/context/query-context"
import { Button } from "@/components/ui/button"
import { Clock, ArrowUpRight } from "lucide-react"

export default function QueryHistory() {
  const { history, submitQuery } = useQuery()

  const handleRerunQuery = (query: string) => {
    submitQuery(query)
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <Clock className="mx-auto h-8 w-8 mb-2 opacity-50" />
        <p>No queries yet</p>
        <p className="text-sm mt-1">Your query history will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {history.map((item, index) => (
        <div
          key={index}
          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700"
        >
          <p className="text-sm text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">{item.query}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(item.timestamp).toLocaleTimeString()}
            </span>
            <Button variant="ghost" size="sm" onClick={() => handleRerunQuery(item.query)} className="h-7 px-2">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              Run again
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}


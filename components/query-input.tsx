"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useQuery } from "@/lib/context/query-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send, Sparkles } from "lucide-react"
import { getSuggestions } from "@/lib/actions/ai-actions"

export default function QueryInput() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const { status, submitQuery } = useQuery()
  const isLoading = status === "loading"

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        setIsLoadingSuggestions(true)
        try {
          const result = await getSuggestions(query)
          setSuggestions(result)
        } catch (error) {
          console.error("Error fetching suggestions:", error)
        } finally {
          setIsLoadingSuggestions(false)
        }
      } else {
        setSuggestions([])
      }
    }

    const debounceTimer = setTimeout(() => {
      if (query.length > 2) {
        fetchSuggestions()
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && !isLoading) {
      submitQuery(query)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Ask a business question (e.g., 'What were our top-selling products last quarter?')"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              if (e.target.value.length > 2) {
                setShowSuggestions(true)
              } else {
                setShowSuggestions(false)
              }
            }}
            onFocus={() => query.length > 2 && setShowSuggestions(true)}
            className="pr-10 py-6 text-base"
            disabled={isLoading}
          />
          {isLoadingSuggestions && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 top-full mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        )}

        <Button type="submit" disabled={!query.trim() || isLoading} className="w-full sm:w-auto ml-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Query
            </>
          )}
        </Button>
      </form>
    </div>
  )
}


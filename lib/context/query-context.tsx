"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import { processQuery } from "@/lib/actions/query-actions"

export interface QueryHistoryItem {
  query: string
  timestamp: number
  result?: any
}

export interface QueryState {
  status: "idle" | "loading" | "succeeded" | "failed"
  currentQuery: string | null
  currentResult: any | null
  history: QueryHistoryItem[]
  error: string | null
}

type QueryAction =
  | { type: "QUERY_PENDING"; payload: string }
  | { type: "QUERY_FULFILLED"; payload: { query: string; result: any } }
  | { type: "QUERY_REJECTED"; payload: string }
  | { type: "SET_STATUS"; payload: "idle" | "loading" | "succeeded" | "failed" }
  | { type: "CLEAR_CURRENT_RESULT" }

const initialState: QueryState = {
  status: "idle",
  currentQuery: null,
  currentResult: null,
  history: [],
  error: null,
}

const queryReducer = (state: QueryState, action: QueryAction): QueryState => {
  switch (action.type) {
    case "QUERY_PENDING":
      return {
        ...state,
        status: "loading",
        currentQuery: action.payload,
        error: null,
      }
    case "QUERY_FULFILLED":
      return {
        ...state,
        status: "succeeded",
        currentResult: action.payload.result,
        history: [
          {
            query: action.payload.query,
            timestamp: Date.now(),
            result: action.payload.result,
          },
          ...state.history.slice(0, 9), // Keep only the last 10 queries
        ],
      }
    case "QUERY_REJECTED":
      return {
        ...state,
        status: "failed",
        error: action.payload,
      }
    case "SET_STATUS":
      return {
        ...state,
        status: action.payload,
      }
    case "CLEAR_CURRENT_RESULT":
      return {
        ...state,
        currentResult: null,
        currentQuery: null,
      }
    default:
      return state
  }
}

interface QueryContextType extends QueryState {
  submitQuery: (query: string) => Promise<void>
  setStatus: (status: "idle" | "loading" | "succeeded" | "failed") => void
  clearCurrentResult: () => void
}

const QueryContext = createContext<QueryContextType | undefined>(undefined)

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(queryReducer, initialState)

  const submitQuery = async (query: string) => {
    dispatch({ type: "QUERY_PENDING", payload: query })
    try {
      const result = await processQuery(query)
      dispatch({ type: "QUERY_FULFILLED", payload: { query, result } })
    } catch (error) {
      dispatch({
        type: "QUERY_REJECTED",
        payload: error instanceof Error ? error.message : "Failed to process query",
      })
    }
  }

  const setStatus = (status: "idle" | "loading" | "succeeded" | "failed") => {
    dispatch({ type: "SET_STATUS", payload: status })
  }

  const clearCurrentResult = () => {
    dispatch({ type: "CLEAR_CURRENT_RESULT" })
  }

  return (
    <QueryContext.Provider
      value={{
        ...state,
        submitQuery,
        setStatus,
        clearCurrentResult,
      }}
    >
      {children}
    </QueryContext.Provider>
  )
}

export const useQuery = () => {
  const context = useContext(QueryContext)
  if (context === undefined) {
    throw new Error("useQuery must be used within a QueryProvider")
  }
  return context
}


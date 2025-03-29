"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "./context/query-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </QueryProvider>
  )
}


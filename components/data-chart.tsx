"use client"

import { useState } from "react"
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ChartType = "bar" | "line" | "pie"

interface DataChartProps {
  data: any[]
  chartType?: ChartType
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#8DD1E1"]

export default function DataChart({ data, chartType = "bar" }: DataChartProps) {
  const [selectedChartType, setSelectedChartType] = useState<ChartType>(chartType)

  // Extract keys for rendering
  const keys = data.length > 0 ? Object.keys(data[0]).filter((key) => key !== "name") : []

  const renderChart = () => {
    switch (selectedChartType) {
      case "bar":
        return (
          <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {keys.map((key, index) => (
              <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
            ))}
          </RechartsBarChart>
        )

      case "line":
        return (
          <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {keys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                activeDot={{ r: 8 }}
              />
            ))}
          </RechartsLineChart>
        )

      case "pie":
        // For pie chart, we'll use the first data point and all its keys except 'name'
        return (
          <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <Tooltip />
            <Legend />
            <Pie
              data={keys.map((key, index) => ({
                name: key,
                value: data[0][key],
              }))}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {keys.map((key, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </RechartsPieChart>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-full">
      <div className="mb-4 flex justify-end">
        <Select value={selectedChartType} onValueChange={(value) => setSelectedChartType(value as ChartType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="line">Line Chart</SelectItem>
            <SelectItem value="pie">Pie Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[calc(100%-40px)]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  )
}


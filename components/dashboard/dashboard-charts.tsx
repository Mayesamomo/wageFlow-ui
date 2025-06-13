"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchEarningsData } from "@/lib/api/dashboard"

interface EarningsDataPoint {
  date: string
  earnings: number
  hours: number
}

export function DashboardCharts() {
  const [data, setData] = useState<EarningsDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getEarningsData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const earningsData = await fetchEarningsData()
        setData(earningsData)
      } catch (error: any) {
        console.error("Failed to fetch earnings data:", error)
        setError(error.response?.data?.message || "Failed to load earnings data")
      } finally {
        setIsLoading(false)
      }
    }

    getEarningsData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px] md:h-[350px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-800">Error: {error}</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] md:h-[350px]">
        <p className="text-muted-foreground">No earnings data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="earnings" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="earnings" className="text-xs md:text-sm">
              Earnings
            </TabsTrigger>
            <TabsTrigger value="hours" className="text-xs md:text-sm">
              Hours
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="earnings" className="space-y-4">
          <div className="h-[250px] md:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                  width={50}
                />
                <Tooltip
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "Earnings"]}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="hours" className="space-y-4">
          <div className="h-[250px] md:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}h`}
                  width={50}
                />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)} hours`, "Hours"]}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

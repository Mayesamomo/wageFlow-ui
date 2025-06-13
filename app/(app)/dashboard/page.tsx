"use client"

import { useState } from "react"
import Link from "next/link"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth/auth-provider"

// Sample data that matches the screenshot
const sampleEarningsData = [
  { date: "Jan", earnings: 150 },
  { date: "Feb", earnings: 280 },
  { date: "Mar", earnings: 210 },
  { date: "Apr", earnings: 180 },
  { date: "May", earnings: 280 },
  { date: "Jun", earnings: 240 },
  { date: "Jul", earnings: 160 },
]

const sampleShifts = [
  {
    id: "1",
    clientName: "Memorial Hospital",
    date: "5/26/2025",
    hours: 7.5,
    earnings: 187.5,
    daysAgo: "2 days ago",
  },
  {
    id: "2",
    clientName: "Sunset Care Home",
    date: "5/24/2025",
    hours: 7.5,
    earnings: 187.5,
    daysAgo: "4 days ago",
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState("Day")
  const [chartTab, setChartTab] = useState("Earnings")

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa]">
      <Header />
      <div className="flex-1 p-6 space-y-6">
        {/* Time Range Tabs */}
        <div className="flex flex-wrap gap-2">
          {["Day", "Week", "Month", "Year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                timeRange === range
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Total Hours</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">168</div>
            <div className="text-xs text-gray-500">Last 30 days</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Total Earnings</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">$4212.50</div>
            <div className="text-xs text-gray-500">Last 30 days</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Total Mileage</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">1250.8 km</div>
            <div className="text-xs text-gray-500">Last 30 days</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Pending Invoices</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">3</div>
            <div className="text-xs text-gray-500">Awaiting payment</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-gray-500 text-sm mb-4">Could not load earnings data. Using sample data.</div>

            {/* Chart Tabs */}
            <div className="flex gap-2 mb-6">
              {["Earnings", "Hours"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setChartTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    chartTab === tab
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleEarningsData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                  <YAxis
                    domain={[100, 300]}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value}`, chartTab]}
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#4ECDC4"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#4ECDC4", strokeWidth: 0 }}
                    activeDot={{ r: 7, fill: "#4ECDC4", strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Shifts Section */}
          <div className="space-y-4">
            <div className="text-gray-500 text-sm">Could not load recent shifts. Using sample data.</div>

            <div className="space-y-3">
              {sampleShifts.map((shift) => (
                <div key={shift.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">{shift.clientName}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {shift.date} • {shift.hours} hours
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 text-lg">${shift.earnings.toFixed(2)}</div>
                      <div className="text-sm text-gray-500 mt-1">{shift.daysAgo}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-2">
              <Link href="/shifts" className="text-blue-600 text-sm font-medium hover:underline">
                View all shifts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

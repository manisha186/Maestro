"use client"

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { monthlyTrendData, categoryBreakdown, discrepancyTypes, dailyTrendData } from "@/lib/analytics-data"

const COLORS = ["#2a7de1", "#ffc857", "#1a1a1a", "#e6eaee"]

export function AnalyticsCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Monthly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="processed"
                stroke="var(--color-primary)"
                strokeWidth={2}
                name="Processed"
              />
              <Line
                type="monotone"
                dataKey="reconciled"
                stroke="var(--color-accent)"
                strokeWidth={2}
                name="Reconciled"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Invoice Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invoice Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Discrepancy Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Discrepancy Types</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={discrepancyTypes}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
              />
              <Bar dataKey="value" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Daily Reconciliation Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daily Reconciliation Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
                formatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />
              <Bar dataKey="amount" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

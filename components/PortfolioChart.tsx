"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactCurrency, formatCurrency } from "@/lib/formatting";
import type { ProjectionPoint, SupportedCurrency } from "@/types/assessment";

interface PortfolioChartProps {
  series: ProjectionPoint[];
  freedomNumber: number;
  currency: SupportedCurrency;
}

export function PortfolioChart({
  series,
  freedomNumber,
  currency,
}: PortfolioChartProps) {
  return (
    <div className="h-64 w-full md:h-72" role="img" aria-label="Portfolio projection chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={series}
          margin={{ top: 24, right: 16, bottom: 0, left: 8 }}
        >
          <CartesianGrid
            stroke="#e7e5e4"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="age"
            type="number"
            domain={["dataMin", "dataMax"]}
            allowDecimals={false}
            tickFormatter={(value: number) => `${value}`}
            tick={{ fontSize: 12, fill: "#78716c" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value: number) =>
              formatCompactCurrency(value, currency)
            }
            tick={{ fontSize: 12, fill: "#78716c" }}
            axisLine={false}
            tickLine={false}
            width={72}
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value), currency)}
            labelFormatter={(label) => `Age ${label}`}
          />
          <ReferenceLine
            y={freedomNumber}
            stroke="#143f33"
            strokeDasharray="6 4"
            strokeWidth={1.5}
            label={{
              value: `Target ${formatCompactCurrency(freedomNumber, currency)}`,
              position: "insideTopRight",
              fill: "#143f33",
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="portfolio"
            name="Projected portfolio"
            stroke="#143f33"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { useFinanceStore } from "@/store/use-finance-store"; // <-- Import Zustand store

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Transaction } from "@/types/transaction";

export const description = "A donut chart showing expenses by category";

// A set of colors mapped to CSS variables (standard shadcn/ui setup)
const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function SpendingChart() {
  const { transactions } = useFinanceStore();

  // 1. Transform data: Group expenses by category
  const chartData = React.useMemo(() => {
    const expenses = transactions.filter((tx: Transaction) => tx.type === "expense");
    
    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach((tx: Transaction) => {
      if (categoryTotals[tx.category]) {
        categoryTotals[tx.category] += tx.amount;
      } else {
        categoryTotals[tx.category] = tx.amount;
      }
    });

    // Convert object to array and assign a color to each category
    return Object.entries(categoryTotals).map(([category, amount], index) => ({
      category,
      amount,
      fill: CHART_COLORS[index % CHART_COLORS.length], 
    }));
  }, [transactions]);

  // 2. Generate config dynamically based on available categories
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      amount: { label: "Amount" },
    };
    chartData.forEach((item) => {
      config[item.category] = {
        label: item.category,
        color: item.fill,
      };
    });
    return config;
  }, [chartData]);

  // 3. Calculate data for the center label (Highest spending category)
  const { maxCategoryName, maxPercentage } = React.useMemo(() => {
    if (chartData.length === 0) return { maxCategoryName: "N/A", maxPercentage: 0 };

    const totalExpenses = chartData.reduce((sum, item) => sum + item.amount, 0);
    const maxItem = chartData.reduce((prev, current) => 
      (prev.amount > current.amount) ? prev : current
    );

    return {
      maxCategoryName: maxItem.category,
      maxPercentage: Math.round((maxItem.amount / totalExpenses) * 100)
    };
  }, [chartData]);

  return (
    <Card className="@container/card flex flex-col w-full h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending Allocation</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0 mt-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-75"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {/* 4. Update dataKey and nameKey */}
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              innerRadius={70}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {maxPercentage}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground uppercase text-xs font-semibold"
                        >
                          {maxCategoryName}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
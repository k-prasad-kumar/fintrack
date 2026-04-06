"use client";

import { useMemo } from "react";
import { useFinanceStore } from "@/store/use-finance-store";
import { AlertTriangle, Lightbulb, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function InsightsPanel() {
  const { transactions } = useFinanceStore();

  const insights = useMemo(() => {
    const expenses = transactions.filter((tx) => tx.type === "expense");
    const income = transactions.filter((tx) => tx.type === "income");
    
    // Default fallback if there's no data yet
    if (expenses.length === 0 && income.length === 0) return null;

    // --- 1. Calculate Highest Spending Category ---
    let highestCategory = { name: "N/A", amount: 0 };
    if (expenses.length > 0) {
      const categoryTotals = expenses.reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {} as Record<string, number>);

      const maxCatName = Object.keys(categoryTotals).reduce((a, b) =>
        categoryTotals[a] > categoryTotals[b] ? a : b
      );
      highestCategory = { name: maxCatName, amount: categoryTotals[maxCatName] };
    }

    // --- 2. Find the Largest Single Expense ---
    let largestExpense = { merchant: "N/A", amount: 0 };
    if (expenses.length > 0) {
      largestExpense = expenses.reduce((max, tx) =>
        tx.amount > max.amount ? tx : max
      );
    }

    // --- 3. Calculate Cash Flow Health (Savings Rate) ---
    const totalIncome = income.reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpense = expenses.reduce((sum, tx) => sum + tx.amount, 0);
    const netFlow = totalIncome - totalExpense;
    
    // Calculate percentage saved, ensuring we don't divide by zero
    const savedPercentage = totalIncome > 0 
      ? ((netFlow / totalIncome) * 100).toFixed(1) 
      : "0.0";

    return {
      highestCategory,
      largestExpense,
      cashFlow: {
        totalIncome,
        totalExpense,
        netFlow,
        savedPercentage,
        isPositive: netFlow >= 0
      }
    };
  }, [transactions]);

  if (!insights) return null;

  return (
    <div className="space-y-4 h-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      
      {/* Insight 1: Highest Category */}
      <Card className="bg-muted/40 border-none shadow-none">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="p-2 bg-rose-500/10 rounded-lg shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="space-y-1 w-full">
            <h4 className="text-sm font-semibold leading-none">
              Highest Spending Category
            </h4>
            <p className="text-xs text-muted-foreground leading-snug">
              <span className="font-medium text-foreground">
                {insights.highestCategory.name}
              </span>{" "}
              costs make up the largest portion of your expenses at{" "}
              <span className="font-medium text-rose-500">
                ${insights.highestCategory.amount.toFixed(2)}
              </span>
              .
            </p>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Monthly Comparison
              </span>
              <Button variant="link" className="h-auto p-0 text-xs text-emerald-500">
                View Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insight 2: Notable Transaction */}
      <Card className="bg-muted/40 border-none shadow-none">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="p-2 bg-amber-500/10 rounded-lg shrink-0">
            <Lightbulb className="w-5 h-5 text-amber-500" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold leading-none">
              Notable Transaction
            </h4>
            <p className="text-xs text-muted-foreground leading-snug">
              You had a large single expense of{" "}
              <span className="font-medium text-amber-500">
                ${insights.largestExpense.amount.toFixed(2)}
              </span>{" "}
              at{" "}
              <span className="font-medium text-foreground">
                {insights.largestExpense.merchant}
              </span>
              .
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Insight 3: Cash Flow Health */}
      <Card className="bg-muted/40 border-none shadow-none">
        <CardContent className="p-4 flex items-start gap-4">
          <div className={`p-2 rounded-lg shrink-0 ${insights.cashFlow.isPositive ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
            {insights.cashFlow.isPositive ? (
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-rose-500" />
            )}
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold leading-none">
              Cash Flow Health
            </h4>
            <p className="text-xs text-muted-foreground leading-snug">
              {insights.cashFlow.isPositive ? (
                <>
                  Great job! You have a positive cash flow, retaining{" "}
                  <span className="font-medium text-emerald-500">{insights.cashFlow.savedPercentage}%</span>{" "}
                  of your income.
                </>
              ) : (
                <>
                  Warning: You are spending more than you earn. You have a deficit of{" "}
                  <span className="font-medium text-rose-500">
                    ${Math.abs(insights.cashFlow.netFlow).toFixed(2)}
                  </span>
                  .
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
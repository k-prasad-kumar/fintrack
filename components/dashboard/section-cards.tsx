"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFinanceStore } from "@/store/use-finance-store";
import { TrendingUpIcon, ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useMemo } from "react";

export function SectionCards() {
  const { transactions } = useFinanceStore();

  // Dynamically calculate the totals
  const { totalIncome, totalExpenses, totalBalance } = useMemo(() => {
    // Calculate Income
    const income = transactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);

    // Calculate Expenses
    const expenses = transactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

    // Calculate Balance
    const balance = income - expenses;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      totalBalance: balance,
    };
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="uppercase">Total Balance</CardDescription>
          <CardTitle className="text-3xl font-extrabold tabular-nums @[250px]/card:text-3xl">
            ${totalBalance.toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mt-5">
            <p className=" flex items-center justify-between gap-1 rounded-full bg-green-700/10 py-1 px-2 text-green-400">
              <TrendingUpIcon size={14} /> <span>+5.4%</span>
            </p>
            <div className="h-14 w-24 flex items-end gap-0.5">
              <div className="bg-primary/20 w-full h-1/2 rounded-t-xs"></div>
              <div className="bg-primary/30 w-full h-3/4 rounded-t-xs"></div>
              <div className="bg-primary/40 w-full h-1/2 rounded-t-xs"></div>
              <div className="bg-primary/50 w-full h-2/3 rounded-t-xs"></div>
              <div className="bg-primary w-full h-full rounded-t-xs"></div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="uppercase">Total Income</CardDescription>
          <CardTitle className="text-3xl font-extrabold tabular-nums @[250px]/card:text-3xl">
            +${totalIncome.toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mt-5">
            <p className=" flex items-center justify-between gap-1 rounded-full bg-green-700/10 py-1 px-2 text-green-400 font-semibold">
              <ArrowDownIcon size={14} /> <span>+14%</span>
            </p>
            <div className="h-14 w-24">
              <svg
                className="w-full h-full text-green-400 drop-shadow-[0_0_8px_rgba(78,222,163,0.3)]"
                viewBox="0 0 100 40"
              >
                <path
                  d="M0,35 Q20,10 40,25 T100,5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3"
                ></path>
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="uppercase">
            Total Expenses
          </CardDescription>
          <CardTitle className="text-3xl font-extrabold tabular-nums @[250px]/card:text-3xl">
            -${totalExpenses.toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mt-5">
            <p className=" flex items-center justify-between gap-1 rounded-full bg-red-700/10 py-1 px-2 text-red-400 font-semibold">
              <ArrowUpIcon size={14} /> <span>-3%</span>
            </p>
            <div className="h-14 w-24">
              <svg
                className="w-full h-full text-red-400 drop-shadow-[0_0_8px_rgba(255,111,125,0.3)]"
                viewBox="0 0 100 40"
              >
                <path
                  d="M0,5 Q30,40 60,20 T100,35"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3"
                ></path>
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

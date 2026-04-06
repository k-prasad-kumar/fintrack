"use client";

import { useMemo, useState } from "react"; // <-- Import useMemo
import { useFinanceStore } from "@/store/use-finance-store";
import { ArrowUpDown, DownloadIcon, MoreHorizontalIcon } from "lucide-react"; // <-- Added ArrowUpDown

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EditTransactionModal } from "./edit-transactions";

export function TransactionsTable() {
  const { transactions, role, deleteTransaction } = useFinanceStore();

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Derive the filtered and sorted data using useMemo
  // This automatically recalculates anytime transactions, category, or sort changes
  const processedTransactions = useMemo(() => {
    // Filter by Category
    let result = transactions;
    if (categoryFilter !== "All") {
      result = result.filter((tx) => tx.category === categoryFilter);
    }

    // Sort the results
    return result.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });
  }, [transactions, categoryFilter, sortBy, sortOrder]);

  const handleSort = (field: "date" | "amount") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const downloadFile = (
    content: string,
    fileName: string,
    contentType: string,
  ) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const jsonString = JSON.stringify(processedTransactions, null, 2);
    downloadFile(jsonString, "transactions.json", "application/json");
  };

  const exportToCSV = () => {
    if (processedTransactions.length === 0) return;

    // Define the headers
    const headers = ["Date", "Merchant", "Category", "Amount", "Type"];

    // Map the data to rows, wrapping merchant strings in quotes just in case they have commas
    const rows = processedTransactions.map((tx) => [
      new Date(tx.date).toLocaleDateString("en-US"),
      `"${tx.merchant}"`, // Escape commas in names like "Apple, Inc."
      tx.category,
      tx.amount.toFixed(2),
      tx.type,
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    downloadFile(csvContent, "transactions.csv", "text/csv;charset=utf-8;");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <h2 className="text-md md:text-lg truncate">Recent Transactions</h2>
          <div className="flex items-center gap-2">
            <Select
              required
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="w-45 truncate">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* Added an 'All' option so users can reset the filter! */}
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Dining">Dining</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                  <SelectItem value="Groceries">Groceries</SelectItem>
                  <SelectItem value="Housing">Housing</SelectItem>
                  <SelectItem value="Salary">Salary</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" title="Export Data">
                  <DownloadIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={exportToCSV}
                  className="cursor-pointer"
                >
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={exportToJSON}
                  className="cursor-pointer"
                >
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
        <CardDescription>You made these transactions recently.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            {processedTransactions.length === 0
              ? "No transactions found for this category."
              : "A list of your recent transactions."}
          </TableCaption>
          <TableHeader>
            <TableRow>
              {/* Added sort toggles to Date and Amount headers */}
              <TableHead className="w-30">
                <Button
                  variant="ghost"
                  className="-ml-4 h-8 data-[state=open]:bg-accent"
                  onClick={() => handleSort("date")}
                >
                  DATE
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>MERCHANT</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="-ml-4 h-8 data-[state=open]:bg-accent"
                  onClick={() => handleSort("amount")}
                >
                  AMOUNT
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>TYPE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Map over the processed array instead of raw transactions! */}
            {processedTransactions.map((transaction) => (
              <TableRow key={transaction.id} className="h-14">
                <TableCell className="text-muted-foreground font-semibold">
                  {new Date(transaction.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="font-bold">
                  {transaction.merchant}
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-muted-foreground/15 rounded text-sm">
                    {transaction.category}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`${
                      transaction.type === "expense" ? "" : "text-green-500"
                    } font-bold`}
                  >
                    {transaction.type === "expense" ? "-" : "+"} $
                    {transaction.amount.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`${
                      transaction.type === "income"
                        ? "text-green-500 bg-green-500/10"
                        : "text-rose-500 bg-rose-500/10"
                    } font-bold px-2 py-1 rounded-full text-xs uppercase tracking-wider`}
                  >
                    {transaction.type}
                  </span>
                </TableCell>
                <TableCell>
                  {role === "admin" ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontalIcon />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <EditTransactionModal transaction={transaction} />

                        <DropdownMenuSeparator />

                        {role === "admin" && (
                          <DropdownMenuItem
                            variant="destructive"
                            className="focus:text-red-800 cursor-pointer"
                            onClick={() => deleteTransaction(transaction.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

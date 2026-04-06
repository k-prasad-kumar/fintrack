"use client";

import { useState } from "react";
import { useFinanceStore } from "@/store/use-finance-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon } from "lucide-react";

export function AddTransactionModal() {
  const { addTransaction, role } = useFinanceStore();
  const [isOpen, setIsOpen] = useState(false);

  // Local form state
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Construct the new transaction object
    const newTransaction = {
      id: `tx-${Date.now()}`, // Quick way to generate a unique ID
      date: new Date().toISOString(),
      merchant,
      amount: parseFloat(amount),
      category,
      type,
      status: "completed" as const,
    };

    // 2. Fire the Zustand action to update global state
    addTransaction(newTransaction);

    // 3. Reset form and close modal
    setMerchant("");
    setAmount("");
    setCategory("");
    setIsOpen(false);
  };

  return (
    <div className={`${role !== "admin" && "hidden"}`}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {/* We use standard Tailwind gradients to match the Stitch design */}
          <span className="flex gap-2">
            {" "}
            <PlusIcon /> Add Transaction
          </span>
        </DialogTrigger>

        <DialogContent
          className="sm:max-w-106.25"
          aria-describedby="add transaction"
        >
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">
                Merchant / Description
              </label>
              <Input
                required
                placeholder="e.g., Apple Store"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Amount</label>
              <Input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={type}
                  onValueChange={(val: "income" | "expense") => setType(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Category</label>
                <Select required value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dining">Dining</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Groceries">Groceries</SelectItem>
                    <SelectItem value="Housing">Housing</SelectItem>
                    <SelectItem value="Salary">Salary</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Transportation">
                      Transportation
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full mt-4">
              Save Transaction
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

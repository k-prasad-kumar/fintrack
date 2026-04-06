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
import { Transaction } from "@/types/transaction";

export function EditTransactionModal({
  transaction,
}: {
  transaction: Transaction;
}) {
  const { updateTransaction } = useFinanceStore();
  const [isOpen, setIsOpen] = useState(false);

  // Local form state
  const [merchant, setMerchant] = useState(transaction.merchant);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [category, setCategory] = useState(transaction.category);
  const [type, setType] = useState(transaction.type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Construct the new transaction object
    const updatedTransaction = {
      merchant,
      amount: parseFloat(amount),
      category,
      type,
    };

    // 2. Fire the Zustand action to update global state
    updateTransaction(transaction.id, updatedTransaction);

    // 3. Reset form and close modal
    setMerchant("");
    setAmount("");
    setCategory("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* We use standard Tailwind gradients to match the Stitch design */}
        <span className="flex gap-2 text-xs p-2 cursor-pointer"> Edit</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25" aria-describedby="Edit Transaction">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
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
                  <SelectItem value="Transportation">Transportation</SelectItem>
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
  );
}

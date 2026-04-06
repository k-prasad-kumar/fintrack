import { create } from 'zustand';
import { mockTransactions } from '@/lib/mock-data'; // Assuming you saved the mock data here
import { Transaction } from '@/types/transaction'; // Assuming you defined your types here

interface FinanceState {
  // State
  role: 'viewer' | 'admin';
  transactions: Transaction[];
  
  // Actions
  setRole: (role: 'viewer' | 'admin') => void;
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, updatedData: Partial<Transaction>) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  // Initial State
  role: 'viewer', // Default to viewer
  transactions: mockTransactions,

  // Action Logic
  setRole: (role) => set({ role }),
  
  addTransaction: (transaction) => 
    set((state) => ({ 
      // Adds new transaction to the top of the array
      transactions: [transaction, ...state.transactions] 
    })),

  updateTransaction: (id, updatedData) =>
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...updatedData } : tx
      ),
    })),
    
  deleteTransaction: (id) => 
    set((state) => ({ 
      transactions: state.transactions.filter((t) => t.id !== id) 
    })),
}));
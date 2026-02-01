import React, { createContext, useContext, useState, ReactNode } from 'react';

export type TransactionType = 'income' | 'expense' | 'bill';

export interface Transaction {
    id: number;
    date: string; // ISO format YYYY-MM-DD
    category: string;
    amount: number;
    note: string;
    type: TransactionType;
    attachment?: boolean;
}

interface TransactionContextType {
    transactions: Transaction[];
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    getTransactionsByType: (type: TransactionType) => Transaction[];
    recentTransactions: Transaction[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: 1, date: "2024-01-28", category: "food", amount: 450, note: "Dinner with friends", type: 'expense' },
        { id: 2, date: "2024-01-29", category: "transport", amount: 200, note: "Uber to work", type: 'expense' },
        { id: 3, date: "2024-01-30", category: "shopping", amount: 1200, note: "New shirt", type: 'expense' },
        { id: 4, date: "2024-02-01", category: "bills", amount: 2500, note: "Electricity Bill", type: 'expense' }, // mapped to expense for simplicity in trends, or handle as bill
        { id: 5, date: "2024-02-02", category: "salary", amount: 85000, note: "Monthly Salary", type: 'income' },
        { id: 6, date: "2024-02-05", category: "entertainment", amount: 800, note: "Movie Night", type: 'expense' },
        { id: 7, date: "2024-02-10", category: "freelance", amount: 12000, note: "Project X", type: 'income' },
    ]);

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction = {
            ...transaction,
            id: Date.now(),
        };
        setTransactions((prev) => [newTransaction, ...prev]);
    };

    const getTransactionsByType = (type: TransactionType) => {
        return transactions.filter(t => t.type === type);
    };

    const recentTransactions = transactions.slice(0, 5);

    return (
        <TransactionContext.Provider value={{ transactions, addTransaction, getTransactionsByType, recentTransactions }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
};

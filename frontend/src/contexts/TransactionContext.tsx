import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '@/lib/api';


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
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get('/dashboard/expenses');
                const backendExpenses = response.data.expenses || [];

                // Map backend data to frontend model
                const mappedTransactions: Transaction[] = backendExpenses.map((t: any, index: number) => ({
                    id: t.id || index + Date.now(), // Fallback ID
                    date: t.date,
                    category: t.category,
                    amount: t.amount,
                    note: t.description || "",
                    type: t.type || 'expense', // Default to expense if missing
                    attachment: false
                }));
                // Sort by date desc
                mappedTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setTransactions(mappedTransactions);
            } catch (error) {
                console.error("Failed to fetch transactions", error);
            }
        };

        fetchTransactions();
    }, []);


    const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        try {
            // Optimistic update
            const tempId = Date.now();
            const newTransaction = { ...transaction, id: tempId };
            setTransactions((prev) => [newTransaction, ...prev]);

            // API Call
            await api.post('/expenses', {
                date: transaction.date,
                category: transaction.category,
                amount: transaction.amount,
                description: transaction.note,
                type: transaction.type
            });

            // Re-fetch or stick with optimistic? Stick with op for now, or update ID if we got one.
        } catch (error) {
            console.error("Failed to add transaction", error);
            // Rollback if needed
        }
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

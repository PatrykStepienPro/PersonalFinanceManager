export type TransactionType = "income" | "expense";

export type Transaction = {
    id: number,
    amount: number,
    description: string,
    type: TransactionType,
    date: string,
    createdAt: string,
    categoryName: string | null
};

export type CreateTransactionRequest = {
    amount: number;
    description: string;
    type: TransactionType,
    date: string,
    categoryId: number | null
};

export type TransactionSummary = {
    totalIncome: number,
    totalExpenses: number,
    balance: number
};
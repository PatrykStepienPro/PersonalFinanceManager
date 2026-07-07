import type { Transaction, CreateTransactionRequest, TransactionSummary} from "../types/transaction.types";
import apiClient from "./client";

export const getTransactions = (): Promise<Transaction[]> => {
    return apiClient.get("/api/transactions").then(x => x.data);
};

export const createTransaction = (data: CreateTransactionRequest): Promise<Transaction> => {
    return apiClient.post<Transaction>("/api/transactions", data).then(x => x.data);
};

export const updateTransaction = (id: number, data: CreateTransactionRequest): Promise<void> => {
    return apiClient.put(`/api/transactions/${id}`, data);
};

export const deleteTransaction = (id: number): Promise<void> => {
    return apiClient.delete(`/api/transactions/${id}`);
};

export const getTransactionSummary = (month: string): Promise<TransactionSummary> => {
    return apiClient.get(`/api/transactions/summary?month=${month}`).then(x => x.data);
}
import type { Budget, CreateBudgetRequest } from "../types/budget.types";
import apiClient from "./client";

export const getBudgets = (): Promise<Budget[]> => {
    return apiClient.get("/api/budgets").then(x => x.data);
};

export const createBudget = (data: CreateBudgetRequest): Promise<Budget> => {
    return apiClient.post("/api/budgets", data).then(x => x.data);
}

export const deleteBudget = (id: number): Promise<void> => {
    return apiClient.delete(`/api/budgets/${id}`);
}
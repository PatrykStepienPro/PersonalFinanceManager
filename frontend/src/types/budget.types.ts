export type Budget = {
    id: number,
    categoryId: number,
    month: string,
    limit: number,
    currentSpending: number,
    remainingBudget: number
};


export type CreateBudgetRequest = {
    categoryId: number,
    month: string,
    limit: number
}
import type { Category } from "@/types/category.types";
import apiClient from "./client";

export const getCategories = (): Promise<Category[]> => {
    return apiClient.get<Category[]>("/api/categories").then(x => x.data);
};
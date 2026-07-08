import { getCategories } from "@/api/category.api";
import { useQuery } from "@tanstack/react-query"

export const useCategories = () =>
    useQuery({
        queryKey: ["categoriestDict"],
        queryFn: getCategories,
        staleTime: 1000 * 60 * 30 // 30 minut
    });

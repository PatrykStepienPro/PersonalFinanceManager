import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { createBudget } from "../api/budgets.api";

const addBudgetSchema = z.object({
    categoryId: z.number().int(),
    month: z.string().regex(
        /^\d{4}-(0[1-9]|1[0-2])$/,
        "Format: YYYY-MM"
    ),
    limit: z.number().positive("Limit musi być większy niż 0")
});

type AddBudgetFormData = z.infer<typeof addBudgetSchema>;

export default function AddBudgetForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<AddBudgetFormData>({
        resolver: zodResolver(addBudgetSchema)
    });

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: createBudget,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] })
        }
    });

    const onSubmit = async (data: AddBudgetFormData) => {
        mutate({
            categoryId: data.categoryId,
            month: data.month,
            limit: data.limit
        });
    }

    return <div style={{ margin: 15 }}>
        <p>Dodaj budżet</p>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("categoryId", { valueAsNumber: true })} type="number" placeholder="Katagoria"/>
            {errors.categoryId && <p>{errors.categoryId.message}</p>}

            <input {...register("month")} placeholder="Miesiąc"/>
            {errors.month && <p>{errors.month.message}</p>}

            <input {...register("limit", { valueAsNumber: true })} type="number" placeholder="Limit" step="0.01"/>
            {errors.limit && <p>{errors.limit.message}</p>}

            <button type="submit">Dodaj</button>
        </form>
    </div>

}
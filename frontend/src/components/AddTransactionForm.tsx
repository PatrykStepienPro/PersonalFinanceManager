import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTransaction } from "../api/transactions.api";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const addTransactionSchema = z.object({
    amount: z.number().positive(),
    description: z.string(),
    type: z.enum(["income", "expense"]),
    date: z.string().min(1, "Data jest wymagana"),
    categoryId: z.number().int("Musi być liczbą całkowitą").optional()
});

type AddTransactionFormData = z.infer<typeof addTransactionSchema>;

export default function AddTransactionForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<AddTransactionFormData>({
        resolver: zodResolver(addTransactionSchema)
    });

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        }
    });

    const onSubmit = async (data: AddTransactionFormData) => {
        mutate({
            amount: data.amount,
            description: data.description,
            type: data.type,
            date: data.date,
            categoryId: data.categoryId ?? null
        });
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("amount", { valueAsNumber: true })} type="number" placeholder="Wartość" step="0.01" />
        {errors.amount && <p>{errors.amount.message}</p>}

        <input {...register("description")} placeholder="Opis" />
        {errors.description && <p>{errors.description.message}</p>}

        <select {...register("type")}>
            <option value="income">Przychód</option>
            <option value="expense">Wydatek</option>
        </select>
        {errors.type && <p>{errors.type.message}</p>}

        <input {...register("date")} type="date" placeholder="Data" />
        {errors.date && <p>{errors.date.message}</p>}

        <input {...register("categoryId", {
            setValueAs: (value) => value === "" ? undefined : Number(value)
        })} type="number" placeholder="Kategoria" />
        {errors.categoryId && <p>{errors.categoryId.message}</p>}

        <button type="submit">Dodaj</button>
    </form>
}

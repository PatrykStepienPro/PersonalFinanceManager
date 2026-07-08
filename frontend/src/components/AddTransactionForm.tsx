import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTransaction } from "../api/transactions.api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Field, FieldLabel, FieldDescription } from "./ui/field";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "./ui/button";

const addTransactionSchema = z.object({
    amount: z.number().positive(),
    description: z.string(),
    type: z.enum(["income", "expense"]),
    date: z.string().min(1, "Data jest wymagana"),
    categoryId: z.number().int("Musi być liczbą całkowitą").optional()
});

type AddTransactionFormData = z.infer<typeof addTransactionSchema>;

const types = [
    { label: "Przychód", value: "income" },
    { label: "Wydatek", value: "expense" }
];

export default function AddTransactionForm({ onSuccess }: { onSuccess?: () => void }) {
    const { data: categories = [] } = useCategories();
    const categoriesDict = categories.map(category => ({
        label: category.name,
        value: category.id
    }));

    const { register, handleSubmit, control, formState: { errors } } = useForm<AddTransactionFormData>({
        resolver: zodResolver(addTransactionSchema)
    });

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            onSuccess?.()
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

    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Field className="mb-3">
                <FieldLabel>Kwota</FieldLabel>
                <Input {...register("amount", { valueAsNumber: true })} type="number" placeholder="Wartość" step="0.01" />
                {errors.amount && <FieldDescription>{errors.amount.message}</FieldDescription>}
            </Field>

            <Field className="mb-3">
                <FieldLabel>Opis</FieldLabel>
                <Input {...register("description")} placeholder="Opis" />
                {errors.description && <FieldDescription>{errors.description.message}</FieldDescription>}
            </Field>


            <Field className="mb-3">
                <FieldLabel>Typ</FieldLabel>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            items={types}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        types.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.type && <FieldDescription>{errors.type.message}</FieldDescription>}
            </Field>

            <Field className="mb-3">
                <FieldLabel>Data</FieldLabel>
                <Input {...register("date")} type="date" />
                {errors.date && <FieldDescription>{errors.date.message}</FieldDescription>}
            </Field>

            <Field className="mb-3">
                <FieldLabel>Kategoria</FieldLabel>
                <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            items={categoriesDict}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        categoriesDict?.map((category) => (
                                            <SelectItem key={category.value} value={category.value}>
                                                {category.label}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.categoryId && <FieldDescription>{errors.categoryId.message}</FieldDescription>}
            </Field>
            <div className="flex justify-end">
                <Button type="submit" className="justify-self-end">Dodaj</Button>
            </div>
        </form>
    </div>
}
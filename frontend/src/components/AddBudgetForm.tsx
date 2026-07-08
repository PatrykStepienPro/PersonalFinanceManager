import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { createBudget } from "../api/budgets.api";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useCategories } from "@/hooks/useCategories";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const addBudgetSchema = z.object({
    categoryId: z.number().int(),
    month: z.string().regex(
        /^\d{4}-(0[1-9]|1[0-2])$/,
        "Format: YYYY-MM"
    ),
    limit: z.number().positive("Limit musi być większy niż 0")
});

type AddBudgetFormData = z.infer<typeof addBudgetSchema>;

export default function AddBudgetForm({ onSuccess }: { onSuccess?: () => void }) {
    const { data: categories = [] } = useCategories();
    const categoriesDict = categories.map(category => ({
        label: category.name,
        value: category.id
    }));

    const { register, handleSubmit, control, formState: { errors } } = useForm<AddBudgetFormData>({
        resolver: zodResolver(addBudgetSchema)
    });

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: createBudget,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] })
            onSuccess?.()
        }
    });

    const onSubmit = async (data: AddBudgetFormData) => {
        mutate({
            categoryId: data.categoryId,
            month: data.month,
            limit: data.limit
        });
    }

    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
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

            <Field className="mb-3">
                <FieldLabel>
                    Miesiąc (YYYY-MM)
                </FieldLabel>
                <Input {...register("month")} placeholder="Miesiąc" />
                {errors.month && <FieldDescription>{errors.month.message}</FieldDescription>}
            </Field>

            <Field className="mb-3">
                <FieldLabel>Kwota</FieldLabel>
                <Input {...register("limit", { valueAsNumber: true })} type="number" placeholder="Limit" step="0.01"/>
                {errors.limit && <FieldDescription>{errors.limit.message}</FieldDescription>}
            </Field>

            <div className="flex justify-end">
                <Button type="submit" className="justify-self-end">Dodaj</Button>
            </div>
        </form>
    </div>
}
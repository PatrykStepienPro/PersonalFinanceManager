import { useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteBudget, getBudgets } from "../api/budgets.api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { MoreHorizontalIcon } from "lucide-react"
import { Button } from "./ui/button";
import { ToDoAlertDialog } from "@/dialog/ToDoAlertDialog";
import { useState } from "react";
import { AddBudgetFormDialog } from "@/dialog/AddBudgetFormDialog";

export default function BudgetComponent() {
    const { data, isLoading } = useQuery({
        queryKey: ["budgets"],
        queryFn: getBudgets
    });
    const [alertOpen, setAlertOpen] = useState(false);
    const queryClient = useQueryClient();
    const onClikDelete = async (id: number) => {
        await deleteBudget(id);
        queryClient.invalidateQueries({ queryKey: ['budgets'] })
    }

    return <>
        <Card>
            <CardHeader className="flex items-center justify-between">
                <CardTitle>Budget</CardTitle>
                <AddBudgetFormDialog/>
            </CardHeader>
            <CardContent>
                {isLoading && <p>Ładowanie danych</p>}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Miesiąc</TableHead>
                            <TableHead>Limit</TableHead>
                            <TableHead>Wydano</TableHead>
                            <TableHead>Pozostało</TableHead>
                            <TableHead>Akcja</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((budget) =>
                            <TableRow key={budget.id}>
                                <TableCell>{budget.month}</TableCell>
                                <TableCell>{budget.limit}</TableCell>
                                <TableCell>{budget.currentSpending}</TableCell>
                                <TableCell>{budget.remainingBudget}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger render={
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8">
                                                <MoreHorizontalIcon />
                                                <span className="sr-only">
                                                    Open menu
                                                </span>
                                            </Button>}>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => setAlertOpen(true)}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                variant="destructive"
                                                className="w-full"
                                                onClick={() => onClikDelete(budget.id)}>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card >
        <ToDoAlertDialog
            open={alertOpen}
            onOpenChange={setAlertOpen} />
    </>
}
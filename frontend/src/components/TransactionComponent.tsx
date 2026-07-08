import { deleteTransaction, getTransactions } from "../api/transactions.api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button";
import { AddTransactionFormDialog } from "@/dialog/AddTransactionFormDialog";
import { ToDoAlertDialog } from "../dialog/ToDoAlertDialog";
import { useState } from "react";

export default function TransactionComponent() {
    const { data } = useQuery({
        queryKey: ["transactions"],
        queryFn: getTransactions
    });
    const [alertOpen, setAlertOpen] = useState(false);
    const queryClient = useQueryClient();

    const onClikDelete = async (id: number) => {
        await deleteTransaction(id);
        queryClient.invalidateQueries({ queryKey: ['transactions'] })
    }

    return <>
        <Card>
            <CardHeader className="flex items-center justify-between">
                <CardTitle>Tranzakcje</CardTitle>
                <AddTransactionFormDialog />
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableHead>Kwota</TableHead>
                        <TableHead>Opis</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Kategoria</TableHead>
                        <TableHead>Akcja</TableHead>
                    </TableHeader>
                    <TableBody>
                        {data?.map(x =>
                            <TableRow key={x.id}>
                                <TableCell>{x.amount}</TableCell>
                                <TableCell>{x.description}</TableCell>
                                <TableCell>{x.type}</TableCell>
                                <TableCell>{x.date}</TableCell>
                                <TableCell>{x.categoryName}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8"><MoreHorizontalIcon /><span className="sr-only">Open menu</span></Button>} />
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => setAlertOpen(true)}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                variant="destructive"
                                                className="w-full"
                                                onClick={() => onClikDelete(x.id)}>
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
        </Card>
        <ToDoAlertDialog
            open={alertOpen}
            onOpenChange={setAlertOpen} />
    </>
};
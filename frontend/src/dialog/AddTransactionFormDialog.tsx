import AddTransactionForm from "@/components/AddTransactionForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export function AddTransactionFormDialog() {
    const [open, setOpen] = useState(false);

    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
            <Button>Dodaj</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader className="font-bold text-base">
                Nowa tranzakcja
            </DialogHeader>
            <AddTransactionForm onSuccess={() => setOpen(false)} />
        </DialogContent>
    </Dialog>
}
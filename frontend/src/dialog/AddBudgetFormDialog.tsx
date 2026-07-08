import AddBudgetForm from "@/components/AddBudgetForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export function AddBudgetFormDialog() {
    const [open, setOpen] = useState(false);

    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={
            <Button>Dodaj</Button>}
        />
        <DialogContent>
            <DialogHeader className="font-bold text-base">
                Nowa tranzakcja
            </DialogHeader>
            <AddBudgetForm onSuccess={() => setOpen(false)} />
        </DialogContent>
    </Dialog>
}
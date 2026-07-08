import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface TodoAlertDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void
}

export function ToDoAlertDialog({ open, onOpenChange }: TodoAlertDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Todo
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Przeprszamy, funckjonalnośc nie jest jeszcze gotowa. Pracujemy nad tym.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Ok
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
import { useQuery } from "@tanstack/react-query"
import { getBudgets } from "../api/budgets.api";
import AddBudgetForm from "./AddBudgetForm";

export default function BudgetComponent() {
    const { data, isLoading } = useQuery({
        queryKey: ["budgets"],
        queryFn: getBudgets
    });

    return <div style={{ marginTop: 15, marginBottom: 15 }}>
        Budget
        {isLoading && <p>Ładowanie danych</p>}
        <ul>
            {data?.map(x =>
                <li key={x.id}>
                    <p>Id: {x.id}</p>
                    <p>Miesiąc: {x.month}</p>
                    <p>Limit: {x.limit}</p>
                    <p>Wydano: {x.currentSpending}</p>
                    <p>Pozostało: {x.remainingBudget}</p>
                </li>
            )}
        </ul>
        <div>
            <AddBudgetForm />
        </div>
    </div>
}
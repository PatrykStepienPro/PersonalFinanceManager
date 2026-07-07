import { useAuth } from "../context/AuthContext";
import { getTransactions } from "../api/transactions.api";
import { useQuery } from "@tanstack/react-query";
import AddTransactionForm from "../components/AddTransactionForm";
import BudgetComponent from "../components/BudgetComponent";
import NotificationComponent from "../components/NotificationComponent";

function DashboardPage() {
    const { logout } = useAuth();
    const { data, isLoading } = useQuery({
        queryKey: ["transactions"],
        queryFn: getTransactions
    });

    return <div>
        <h1>Dashboard</h1>
        {isLoading && <p>Ładowanie tranzakcji...</p>}
        <ul>
            {
                data?.map(x =>
                    <li key={x.id}>
                        <p>{x.id}</p>
                        <p>{x.description}</p>
                    </li>
                )
            }
        </ul>
        <AddTransactionForm />
        <BudgetComponent/>
        <NotificationComponent/>
        <button onClick={logout}>Wyloguj</button>
    </div>
}

export default DashboardPage;
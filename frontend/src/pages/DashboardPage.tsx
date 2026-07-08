import { useAuth } from "../context/AuthContext";
import BudgetComponent from "../components/BudgetComponent";
import NotificationComponent from "../components/NotificationComponent";
import { Button } from "@/components/ui/button";
import TransactionComponent from "@/components/TransactionComponent";

function DashboardPage() {
    const { logout } = useAuth();

    return <div className="min-h-screen flex items-center justify-center flex-col">
        <div className="flex mt-2 gap-2">
            <h1 className="text-xl font-bold">Personal Finance Manager</h1>
            <Button onClick={logout}>Wyloguj</Button>
        </div>
        <div className="max-w-3xl mx-auto p-6 flex flex-col gap-8">
            <section>
                <TransactionComponent />
            </section>

            <section>
                <BudgetComponent />
            </section>
        </div>


        <NotificationComponent />
    </div>
}

export default DashboardPage;
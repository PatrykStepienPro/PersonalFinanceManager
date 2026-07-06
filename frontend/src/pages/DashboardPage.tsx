import { useAuth } from "../context/AuthContext";

function DashboardPage() {
    const { logout } = useAuth();

    return <div>
        <h1>Dashboard</h1>
        <button onClick={logout}>Wyloguj</button>
    </div>
}

export default DashboardPage;
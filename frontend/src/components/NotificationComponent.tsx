import { useQuery } from "@tanstack/react-query";
import { getNotifications, markAsRead } from "../api/notification.api";
import { useQueryClient } from "@tanstack/react-query";


export default function NotificationComponent() {
    const { data, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications
    });

    const queryClient = useQueryClient();
    const onClickMarkAsRead = async (id: number) => {
        await markAsRead(id);
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
    };

    return <div style={{ margin: 15 }}>
        <p>Powiadomienia</p>
        <ul>
            {isLoading && <p>Ładowanie</p>}
            {data?.map(x =>
                <li key={x.id}>
                    <p>Id: {x.id}</p>
                    <p>Powiadomienie: {x.message}</p>
                    <p>Odczytane: {x.isRead ? "Tak" : "Nie"}</p>
                    {!x.isRead && <button onClick={() => onClickMarkAsRead(x.id)}>Odczytane</button>}
                </li>
            )}
        </ul>
    </div>
}
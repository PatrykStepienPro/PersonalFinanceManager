import apiClient from "./client";
import type { Notification } from "../types/notification.types";

export const getNotifications = (): Promise<Notification[]> => {
    return apiClient.get("/api/notifications").then(x => x.data);
};

export const markAsRead = (id: number): Promise<void> => {
    return apiClient.put(`/api/notifications/${id}/read`);
}
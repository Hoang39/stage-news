"use client";

import React, { createContext, useContext } from "react";

import { notification } from "antd";
import { NotificationConfig } from "antd/es/notification/interface";

type NotificationType = "success" | "info" | "warning" | "error";

interface NotificationContextType {
    openNotification: (
        type: NotificationType,
        message: string,
        description?: string,
        config?: NotificationConfig
    ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotificationContext must be used within a NotificationProvider");
    }
    return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (
        type: NotificationType,
        message: string,
        description?: string,
        config?: NotificationConfig
    ) => {
        api[type]({
            message,
            description,
            placement: "topRight",
            ...config
        });
    };

    return (
        <NotificationContext.Provider value={{ openNotification }}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
};

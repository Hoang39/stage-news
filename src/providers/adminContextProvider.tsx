"use client";

import { ReactNode, createContext, useState } from "react";

import { News } from "@/interfaces/news";
import { Partner } from "@/interfaces/partner";
import { Popup } from "@/interfaces/popup";
import { User } from "@/interfaces/user";

type AdminContextType = {
    news: News[];
    users: User[];
    popup: Popup[];
    partner: Partner[];
    newsSelection: { onChange: (_: any, selectedRows: any) => void };
    popupSelection: { onChange: (_: any, selectedRows: any) => void };
    partnerSelection: { onChange: (_: any, selectedRows: any) => void };
    usersSelection: { onChange: (_: any, selectedRows: any) => void };
    reset: () => void;
    resetExp: (value: string) => void;
};

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [news, setNews] = useState<News[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [popup, setPopup] = useState<Popup[]>([]);
    const [partner, setPartner] = useState<Partner[]>([]);

    const newsSelection = {
        onChange: (_: any, selectedRows: any) => {
            setNews(selectedRows);
        }
    };

    const popupSelection = {
        onChange: (_: any, selectedRows: any) => {
            setPopup(selectedRows);
        }
    };

    const partnerSelection = {
        onChange: (_: any, selectedRows: any) => {
            setPopup(selectedRows);
        }
    };

    const usersSelection = {
        onChange: (_: any, selectedRows: any) => {
            setUsers(selectedRows);
        },
        getCheckboxProps: (record: any) => ({
            disabled: record.id == JSON.parse(localStorage.getItem("user") as string)?.id
        })
    };

    const reset = () => {
        setNews([]);
        setUsers([]);
        setPopup([]);
        setPartner([]);
    };

    const resetExp = (pathname: string) => {
        if (pathname != "news") setNews([]);
        if (pathname != "popup") setPopup([]);
        if (pathname != "user") setUsers([]);
        if (pathname != "partner") setPartner([]);
    };

    return (
        <AdminContext.Provider
            value={{
                news,
                newsSelection,
                users,
                usersSelection,
                popup,
                popupSelection,
                partner,
                partnerSelection,
                reset,
                resetExp
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

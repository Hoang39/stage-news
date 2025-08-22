import { Handshake, Newspaper, PictureInPicture2, UserCog, UserRoundPen } from "lucide-react";

export type MenuItem = {
    icn: React.ReactElement;
    name: string;
    path: string;
    roles?: string[];
    editBtn: boolean;
};

export const menuList: MenuItem[] = [
    {
        icn: <Newspaper size={16} />,
        name: "news",
        path: "/admin/news",
        roles: ["admin", "owner"],
        editBtn: true
    },
    {
        icn: <PictureInPicture2 size={16} />,
        name: "popup",
        path: "/admin/popup",
        roles: ["admin", "owner"],
        editBtn: true
    },
    {
        icn: <Handshake size={16} />,
        name: "partner",
        path: "/admin/partner",
        roles: ["admin", "owner"],
        editBtn: true
    },
    {
        icn: <UserCog size={16} />,
        name: "user",
        path: "/admin/user",
        roles: ["owner"],
        editBtn: true
    },
    {
        icn: <UserRoundPen size={16} />,
        name: "profile",
        path: "/admin/profile",
        roles: ["admin", "owner"],
        editBtn: false
    }
];

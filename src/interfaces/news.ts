import dayjs from "dayjs";

export interface News {
    id: number;
    title: string;
    author: string;
    content: string;
    description: string;
    views: number;
    slug: string;
    createdAt: dayjs.Dayjs;
    disabled: boolean;
    site: string;
    userId: number;
}

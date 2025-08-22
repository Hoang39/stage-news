import dayjs from "dayjs";

export interface Partner {
    id: number;
    title: string;
    link: string;
    image: string;
    disabled: boolean;
    date: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
    userId: number;
}

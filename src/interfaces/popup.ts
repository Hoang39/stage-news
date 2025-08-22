import dayjs from "dayjs";

export interface Popup {
    id: number;
    title: string;
    link: string;
    image: string;
    width: number;
    height: number;
    placement: string;
    site: string;
    disabled: boolean;
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
    margin: string;
    userId: number;
}

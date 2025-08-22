import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const getUserTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const timeInUserTimezone = (date: Date | string, format: string) => {
    const timezone = getUserTimezone();
    return dayjs(date).tz(timezone).format(format);
};

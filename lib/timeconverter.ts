import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getAlmatyNow = () => {
  return dayjs().utcOffset(300); // 5 hours = 300 minutes
};

export const getAlmatyDateAtHour = (hour: number): Date => {
  return dayjs()
    .tz("Asia/Almaty")
    .hour(hour)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toDate();
};

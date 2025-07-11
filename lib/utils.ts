export const formatTime = (duration: number) => {
  const hours = String(Math.floor(duration / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((duration % 3600) / 60)).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export function formatStartTime(start_time: string) {
  const date = new Date(start_time);

  const monthNames = [
    "Января",
    "Февраля",
    "Марта",
    "Апреля",
    "Мая",
    "Июня",
    "Июля",
    "Августа",
    "Сентября",
    "Октября",
    "Ноября",
    "Декабря",
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

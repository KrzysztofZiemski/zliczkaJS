export const getStringData = (date: Date, reverse: boolean = false) => {
  const getDate = date.getFullYear();
  const month =
    date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;

  if (reverse) return `${getDate}-${month}-${day}`;
  return `${day}-${month}-${getDate}`;
};

export const setDateFormat = (date: Date): Date =>
  new Date(date.toJSON().slice(0, 10).replace(/-/g, "/"));

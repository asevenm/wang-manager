import dayjs from 'dayjs';

export const formatDate = (date: string | Date | number) => {
 return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

export const object2Search = (obj: Record<string, any>) => {
  let search = '?';
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      search += `${key}=${value}&`;
    }
  });
  return search.slice(0, search.length - 1);
}
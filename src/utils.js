import dayjs from 'dayjs';

const MINUTES_IN_HOURS = 60;
const HOURS_IN_DAY = 24;

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const humanizeEventDate = (dueDate) => dayjs(dueDate).format('D MMMM');
const humanizeEventtime = (dueDate) => dayjs(dueDate).format('HH:mm');

const durationInDays = (dateFrom, dateTo) => dayjs(dateFrom).diff(dayjs(dateTo), 'day');
const durationInHours = (dateFrom, dateTo) => dayjs(dateFrom).diff(dayjs(dateTo), 'hour');
const durationInMinutes = (dateFrom, dateTo) => dayjs(dateFrom).diff(dayjs(dateTo), 'minute');

const getTimeDuration = (dateTo, dateFrom) => {
  const days = `${durationInDays(dateTo, dateFrom)}`;
  const hours = `${durationInHours(dateTo, dateFrom)}`;
  const minutes = `${durationInMinutes(dateTo, dateFrom) + 1}`;

  const shownDays = days === '0' ? '' : `${days}D `;
  const shownHours = hours === '0'
    ? ''
    : `${String(hours % HOURS_IN_DAY).padStart(2, '0')}H `;
  const shownMinutes = minutes === '0'
    ? ''
    : `${String(minutes % MINUTES_IN_HOURS).padStart(2, '0')}M`;

  return `${shownDays}${shownHours}${shownMinutes}`;
};

export { getRandomInteger, humanizeEventDate, humanizeEventtime, getTimeDuration };

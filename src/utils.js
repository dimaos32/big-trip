import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const humanizeEventDate = (dueDate) => dayjs(dueDate).format('D MMMM');
const humanizeEventtime = (dueDate) => dayjs(dueDate).format('HH:mm');

const humanizeDateAndTime = (dueDate) => dayjs(dueDate).format('DD/MM/YY HH:mm');

const getTimeDuration = (dateTo, dateFrom) =>
  dayjs
    .duration(dayjs(dateTo).diff(dayjs(dateFrom).startOf('minute')))
    .format('D[D] HH[H] mm[M]')
    .replace(/^0D /, '')
    .replace(/^00H /, '')
    .replace(/^0/, '');

const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export { getRandomInteger, humanizeEventDate, humanizeEventtime, humanizeDateAndTime, getTimeDuration, isEscEvent };

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

const getTimeDuration = (dateTo, dateFrom) => {
  const currentDuration = dayjs
    .duration(dayjs(dateTo).diff(dayjs(dateFrom)))
    .add(1, 'minute');
  const days = currentDuration.days();
  const hours = currentDuration.hours();
  const minutes = currentDuration.minutes();

  const shownDays = days === 0 ? '' : `${days}D `;
  const shownHours = hours === 0
    ? ''
    : `${String(hours).padStart(2, '0')}H `;
  const shownMinutes = minutes === 0
    ? ''
    : `${String(minutes).padStart(2, '0')}M`;

  return `${shownDays}${shownHours}${shownMinutes}`;
};

export { getRandomInteger, humanizeEventDate, humanizeEventtime, humanizeDateAndTime, getTimeDuration };

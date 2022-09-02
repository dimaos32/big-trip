import { getRandomInteger } from './common';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOURS = 60;
const SECONDS_IN_MINUTES = 60;

const MAX_DAYS_GAP = 3;
const MIN_HOURS_DURATION = 1;
const MAX_HOURS_DURATION = 12;

const MAX_SECONDS_GAP = MAX_DAYS_GAP * HOURS_IN_DAY * MINUTES_IN_HOURS * SECONDS_IN_MINUTES;
const MIN_SECONDS_DURATION = MIN_HOURS_DURATION * MINUTES_IN_HOURS * SECONDS_IN_MINUTES;
const MAX_SECONDS_DURATION = MAX_HOURS_DURATION * MINUTES_IN_HOURS * SECONDS_IN_MINUTES;

const humanizeEventDate = (dueDate) => dayjs(dueDate).format('D MMMM');
const humanizeEventtime = (dueDate) => dayjs(dueDate).format('HH:mm');

const humanizeDateAndTime = (dueDate) => dayjs(dueDate).format('DD/MM/YY HH:mm');

const isFutureEvent = (dueDate) => dueDate && dayjs().isBefore(dueDate, 'Day');
const isPastEvent = (dueDate) => dueDate && dayjs().isAfter(dueDate, 'Day');

const getTimeDuration = (dateTo, dateFrom) =>
  dayjs
    .duration(dayjs(dateTo).diff(dayjs(dateFrom).startOf('minute')))
    .format('D[D] HH[H] mm[M]')
    .replace(/^0D /, '')
    .replace(/^00H /, '')
    .replace(/^0/, '');

const generatePeriod = () => {
  const secondsGaps = getRandomInteger(-MAX_SECONDS_GAP, MAX_SECONDS_GAP);
  const EventDuration = getRandomInteger(MIN_SECONDS_DURATION, MAX_SECONDS_DURATION);

  return [
    dayjs().add(secondsGaps, 'second').toDate(),
    dayjs().add(secondsGaps + EventDuration, 'second').toDate(),
  ];
};

export {
  humanizeEventDate, humanizeEventtime, humanizeDateAndTime, isFutureEvent, isPastEvent,
  getTimeDuration, generatePeriod,
};

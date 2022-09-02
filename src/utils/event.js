import { getRandomInteger } from './common';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOURS = 60;
const SECONDS_IN_MINUTES = 60;

const MAX_DAYS_GAP = 3;
const MAX_SECONDS_GAP = MAX_DAYS_GAP * HOURS_IN_DAY * MINUTES_IN_HOURS * SECONDS_IN_MINUTES;

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

const generatePeriod = () => {
  const secondsGaps = [
    getRandomInteger(-MAX_SECONDS_GAP, MAX_SECONDS_GAP),
    getRandomInteger(-MAX_SECONDS_GAP, MAX_SECONDS_GAP),
  ];

  return [
    dayjs().add(secondsGaps[0], 'second').toDate(),
    dayjs().add(secondsGaps[1], 'second').toDate(),
  ].sort((a, b) => a < b);
};

export { humanizeEventDate, humanizeEventtime, humanizeDateAndTime, getTimeDuration, generatePeriod };

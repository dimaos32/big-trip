import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);


const humanizeEventDate = (dueDate, isSimple = false) =>
  isSimple
    ? dayjs(dueDate).format('MMM D')
    : dayjs(dueDate).format('D MMMM');
const humanizeEventtime = (dueDate) => dayjs(dueDate).format('HH:mm');

const isNotStartedEvent = (dueDate) => dueDate && dayjs().isBefore(dueDate, 'Day');
const isEndedEvent = (dueDate) => dueDate && dayjs().isAfter(dueDate, 'Day');

const getTimeDuration = (dateTo, dateFrom) =>
  dayjs
    .duration(dayjs(dateTo).diff(dayjs(dateFrom).startOf('minute')))
    .format('D[D] HH[H] mm[M]')
    .replace(/^0D /, '')
    .replace(/^00H /, '')
    .replace(/^0/, '');

const sortByDate = (eventA, eventB) => dayjs(eventA.dateFrom).diff(dayjs(eventB.dateFrom));

const sortByTime = (eventA, eventB) => (eventB.dateTo - eventB.dateFrom) - (eventA.dateTo - eventA.dateFrom);

const sortByPrice = (eventA, eventB) => eventB.basePrice - eventA.basePrice;

export {
  humanizeEventDate, humanizeEventtime, isNotStartedEvent, isEndedEvent,
  getTimeDuration, sortByDate, sortByTime, sortByPrice,
};

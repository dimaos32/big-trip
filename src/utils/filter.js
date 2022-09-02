import { FilterType } from '../const';
import { isFutureEvent, isPastEvent } from './event';

const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => isFutureEvent(event.dateFrom)),
  [FilterType.PAST]: (events) => events.filter((event) => isPastEvent(event.dateTo)),
};

export { filter };

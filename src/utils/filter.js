import { FilterType } from '../const';
import { isNotStartedEvent, isEndedEvent } from './event';

const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => isNotStartedEvent(event.dateFrom)),
  [FilterType.PAST]: (events) => events.filter((event) => isEndedEvent(event.dateFrom)),
};

export { filter };

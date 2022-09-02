import { filter } from '../utils/filter';

const generateFilter = (events) => Object.entries(filter).map(
  ([filterName, filterEvents]) => ({
    name: filterName,
    count: filterEvents(events).length,
  })
);

export { generateFilter };

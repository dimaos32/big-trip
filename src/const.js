const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const SORT_TYPES = [
  { name: 'Day', type: 'day', isEnabled: true },
  { name: 'Event', type: 'event' },
  { name: 'Time', type: 'time', isEnabled: true },
  { name: 'Price', type: 'price', isEnabled: true },
  { name: 'Offers', type: 'offer' },
];

const Message = {
  NO_EVENTS: 'Click New Event to create your first point',
};

const SortType = {
  DATE_UP: 'sort-day',
  TIME_UP: 'sort-time',
  PRICE_UP: 'sort-price',
};

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  REMOVE_EVENT: 'REMOVE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export { FilterType, SORT_TYPES, Message, SortType, UserAction, UpdateType };

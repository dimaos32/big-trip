const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const SORT_TYPES = [
  { text: 'Day', type: 'day', isEnabled: true },
  { text: 'Event', type: 'event' },
  { text: 'Time', type: 'time', isEnabled: true },
  { text: 'Price', type: 'price', isEnabled: true },
  { text: 'Offers', type: 'offer' },
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

const EventEditViewMode = {
  ADD: 'add',
  EDIT: 'edit',
};

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
  NO_EVENTS: {
    everything: 'Click New Event to create your first point',
    future: 'There are no future events now',
    past: 'There are no past events now',
  },
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
  INIT: 'INIT',
};

const AUTHORIZATION = 'Basic v6ks2xpmc9pa7u8qx6';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const BtnActiveValue = {
  'Save': 'Saving',
  'Delete': 'Deleting',
};

const MAX_SHOWN_DESTINATIONS = 3;

export {
  EventEditViewMode,
  FilterType,
  SORT_TYPES,
  Message,
  SortType,
  UserAction,
  UpdateType,
  AUTHORIZATION,
  END_POINT,
  TimeLimit,
  BtnActiveValue,
  MAX_SHOWN_DESTINATIONS,
};

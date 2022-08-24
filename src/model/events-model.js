import { generateEvent } from '../mock/events';
import { getRandomInteger } from '../utils';

const generateEvents = () => {
  const key = getRandomInteger(0, 3);

  if (key === 1) {
    return [];
  }

  if (key === 2) {
    return Array.from({length: 3}, generateEvent);
  }

  if (key === 3) {
    return Array.from({length: 5}, generateEvent);
  }

  return null;
};

export default class EventsModel {
  #events = generateEvents();

  get events() {
    return this.#events;
  }
}

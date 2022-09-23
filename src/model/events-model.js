import Observable from '../framework/observable';
import { generateEvent } from '../mock/events';
import { getRandomInteger } from '../utils/common';

const generateEvents = () => {
  const key = getRandomInteger(1, 3);

  if (key === 1) {
    return [];
  }

  if (key === 2) {
    return Array.from({length: 3}, generateEvent);
  }

  if (key === 3) {
    return Array.from({length: 5}, generateEvent);
  }
};

export default class EventsModel extends Observable {
  #events = generateEvents();

  get events() {
    return this.#events;
  }


  updateEvent = (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Невозможно обновить несуществующее событие');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      update,
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addEvent = (updateType, update) => {
    this.#events = [
      update,
      ...this.#events,
    ];

    this._notify(updateType, update);
  };
}

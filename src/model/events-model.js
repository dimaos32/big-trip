import Observable from '../framework/observable';
import { generateEvent } from '../mock/events';
import { getRandomInteger } from '../utils/common';

const generateEvents = () => {
  const key = getRandomInteger(1, 4);

  switch (key) {
    case 1:
      return Array.from({length: 4}, generateEvent);
    case 2:
      return Array.from({length: 7}, generateEvent);
    case 3:
      return Array.from({length: 11}, generateEvent);
    default:
      return [];
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

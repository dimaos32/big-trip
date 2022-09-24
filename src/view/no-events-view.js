import AbstractView from '../framework/view/abstract-view';
import { Message } from '../const';

const createNoEventsTemplate = (filterType) => {
  const noEventsMessage = Message.NO_EVENTS[filterType];

  return `<p class="trip-events__msg">${noEventsMessage}</p>`;
};

export default class EventView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoEventsTemplate(this.#filterType);
  }
}

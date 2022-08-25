import { createElement } from '../render';
import { Message } from '../const';

const createNoEventsTemplate = () =>
  `<p class="trip-events__msg">${Message.NO_EVENTS}</p>`;

export default class EventView {
  #element = null;

  get template() {
    return createNoEventsTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

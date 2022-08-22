import { createElement } from '../render';

const createEventsItemTemplate = () => '<li class="trip-events__item"></li>';

export default class EventsItemView {
  #element = null;

  get template() {
    return createEventsItemTemplate();
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

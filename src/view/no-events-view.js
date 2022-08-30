import AbstractView from '../framework/view/abstract-view';
import { Message } from '../const';

const createNoEventsTemplate = () =>
  `<p class="trip-events__msg">${Message.NO_EVENTS}</p>`;

export default class EventView extends AbstractView {
  get template() {
    return createNoEventsTemplate();
  }
}

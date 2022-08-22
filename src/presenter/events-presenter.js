import { RenderPosition, render } from '../render';
import { getOffersByType} from '../mock/offers-by-type';

import EventsListView from '../view/events-list-view';
import EventsItemView from '../view/events-item-view';
import EventEditView from '../view/event-edit-view';

import EventView from '../view/event-view';

const offersByType = getOffersByType();

export default class EventsPresenter {
  #eventsContainer = null;

  #eventsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #events = null;
  #offers = null;
  #destinations = null;

  #eventsComponent = new EventsListView();

  renderEventsItem = (content, place = RenderPosition.BEFOREEND) => {
    const itemElement = new EventsItemView();
    render(itemElement, this.#eventsComponent.element, place);
    render(content, itemElement.element);
  };

  #renderEvent = (event) => {
    const eventComponent = new EventView(event, this.#offers, this.#destinations);
    const eventEditComponent = new EventEditView(event, this.#offers, this.#destinations, offersByType);
    const eventEditBtn = eventComponent.element.querySelector('.event__rollup-btn');

    const activateEditEvent = () => {
      eventComponent.element.parentNode.replaceChild(eventEditComponent.element, eventComponent.element);
    };

    const deactivateEditEvent = () => {
      eventEditComponent.element.parentNode.replaceChild(eventComponent.element, eventEditComponent.element);
    };

    eventEditBtn.addEventListener('click', () => {
      activateEditEvent();
    });

    eventEditComponent.element.addEventListener('submit', (evt) => {
      evt.preventDefault();
      deactivateEditEvent();
    });

    this.renderEventsItem(eventComponent);
  };

  init = (eventsContainer, eventsModel, offersModel, destinationsModel) => {
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#events = [...this.#eventsModel.events];
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];

    render(this.#eventsComponent, this.#eventsContainer);
    // this.renderEventsItem(new EventEditFormView(this.#events[0], this.#offers, this.#destinations, offersByType), RenderPosition.AFTERBEGIN);

    this.#events.forEach((event) => {
      this.#renderEvent(event);
    });
  };
}

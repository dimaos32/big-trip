import { RenderPosition, render } from '../render';
import { isEscEvent } from '../utils';
import { getOffersByType} from '../mock/offers-by-type';

import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import EventsItemView from '../view/events-item-view';
import EventEditView from '../view/event-edit-view';
import EventView from '../view/event-view';
import noEventsView from '../view/no-events-view';

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
  #noEventsComponent = new noEventsView();

  renderEventsItem = (content, place = RenderPosition.BEFOREEND) => {
    const itemElement = new EventsItemView();
    render(itemElement, this.#eventsComponent.element, place);
    render(content, itemElement.element);
  };

  #renderEvent = (event) => {
    const eventComponent = new EventView(event, this.#offers, this.#destinations);
    const eventEditComponent = new EventEditView(event, this.#offers, this.#destinations, offersByType);
    const eventEditBtn = eventComponent.element.querySelector('.event__rollup-btn');
    const cancelEditBtn = eventEditComponent.element.querySelector('.event__reset-btn');

    const activateEditEvent = () => {
      eventComponent.element.parentNode.replaceChild(eventEditComponent.element, eventComponent.element);
    };

    const deactivateEditEvent = () => {
      eventEditComponent.element.parentNode.replaceChild(eventComponent.element, eventEditComponent.element);
    };

    const cancelEditEvent = () => {
      deactivateEditEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    };

    function onEscKeyDown(evt) {
      if (isEscEvent(evt)) {
        evt.preventDefault();
        cancelEditEvent();
      }
    }

    eventEditBtn.addEventListener('click', () => {
      activateEditEvent();
      document.addEventListener('keydown', onEscKeyDown);
    });

    cancelEditBtn.addEventListener('click', () => {
      cancelEditEvent();
    });

    eventEditComponent.element.addEventListener('submit', (evt) => {
      evt.preventDefault();
      cancelEditEvent();
    });

    this.renderEventsItem(eventComponent);
  };

  init = (eventsContainer, eventsModel, offersModel, destinationsModel) => {
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#events = this.#eventsModel.events ? [...this.#eventsModel.events] : [];
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];

    if (!this.#events.length) {
      render(this.#noEventsComponent, this.#eventsContainer);
    } else {
      render(new SortView(), this.#eventsContainer);
      render(this.#eventsComponent, this.#eventsContainer);

      this.#events.forEach((event) => {
        this.#renderEvent(event);
      });
    }
  };
}

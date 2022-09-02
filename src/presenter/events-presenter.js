import { render, replace } from '../framework/render';

import { isEscEvent } from '../utils/common';
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

  renderEventsItem = (content) => {
    const itemElement = new EventsItemView();
    render(itemElement, this.#eventsComponent.element);
    render(content, itemElement.element);
  };

  #renderEvent = (event) => {
    const eventComponent = new EventView(event, this.#offers, this.#destinations);
    const eventEditComponent = new EventEditView(event, this.#offers, this.#destinations, offersByType);

    const activateEditEvent = () => {
      replace(eventEditComponent, eventComponent);
    };

    const deactivateEditEvent = () => {
      replace(eventComponent, eventEditComponent);
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

    eventComponent.setEditClickHandler(() => {
      activateEditEvent();
      document.addEventListener('keydown', onEscKeyDown);
    });

    eventEditComponent.setCancelEditClickHandler(() => {
      cancelEditEvent();
    });

    eventEditComponent.setSubmitHandler(() => {
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
      return;
    }

    render(new SortView(), this.#eventsContainer);
    render(this.#eventsComponent, this.#eventsContainer);

    this.#events.forEach((event) => {
      this.#renderEvent(event);
    });
  };
}

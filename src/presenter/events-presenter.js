import { render, replace } from '../framework/render';

import { isEscEvent } from '../utils/common';
import { getOffersByType} from '../mock/offers-by-type';
import { generateFilter } from '../mock/filter.js';

import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import EventEditView from '../view/event-edit-view';
import EventView from '../view/event-view';
import noEventsView from '../view/no-events-view';

const offersByType = getOffersByType();

export default class EventsPresenter {
  #filterContainer = null;
  #eventsContainer = null;

  #eventsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #events = null;
  #offers = null;
  #destinations = null;
  #filter = null;

  #eventsComponent = new EventsListView();
  #noEventsComponent = new noEventsView();

  init = (filterContainer, eventsContainer, eventsModel, offersModel, destinationsModel) => {
    this.#filterContainer = filterContainer;
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#events = this.#eventsModel.events ? [...this.#eventsModel.events] : [];
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#filter = generateFilter(this.#events);

    this.#renderFilter();

    this.#renderEventsBoard();
  };

  #renderFilter = () => {
    render(new FilterView(this.#filter), this.#filterContainer);
  };

  #renderSortBar = () => {
    render(new SortView(), this.#eventsContainer);
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

    render(eventComponent, this.#eventsComponent.element);
  };

  #renderEvents = () => {
    render(this.#eventsComponent, this.#eventsContainer);

    this.#events.forEach((event) => {
      this.#renderEvent(event);
    });
  };

  #renderNoEvents = () => {
    render(this.#noEventsComponent, this.#eventsContainer);
  };

  #renderEventsBoard = () => {
    if (!this.#events.length) {
      this.#renderNoEvents();
    } else {
      this.#renderSortBar();
      this.#renderEvents();
    }
  };
}

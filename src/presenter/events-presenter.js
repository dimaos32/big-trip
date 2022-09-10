import { render } from '../framework/render';

import { getOffersByType} from '../mock/offers-by-type';
import { generateFilter } from '../mock/filter.js';

import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import noEventsView from '../view/no-events-view';
import EventPresenter from './event-presenter';

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
    const eventPresenter = new EventPresenter(
      this.#eventsComponent.element, this.#events, this.#offers,
      offersByType, this.#destinations,
    );

    eventPresenter.init(event);
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

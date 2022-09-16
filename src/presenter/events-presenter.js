import { render, remove } from '../framework/render';

import { SortType } from '../const';

import { generateFilter } from '../mock/filter';

import { updateItem } from '../utils/common';
import { sortByDate, sortByTime, sortByPrice } from '../utils/event';

import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import noEventsView from '../view/no-events-view';
import EventPresenter from './event-presenter';

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

  #filterComponent = null;
  #sortComponent = new SortView();
  #eventsComponent = new EventsListView();
  #noEventsComponent = new noEventsView();

  #eventPresenter = new Map();

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
    this.#filterComponent = new FilterView(this.#filter);

    this.#events.sort(this.#sortEvents(SortType.DATE_UP));

    this.#renderFilter();

    this.#renderEventsBoard();
  };

  #handleModeChange = () => {
    this.#eventPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleEventChange = (updatedEvent) => {
    this.#events = updateItem(this.#events, updatedEvent);
    this.#eventPresenter.get(updatedEvent.id).init(updatedEvent);
  };

  #handleSortTypeChange = (sortType) => {
    this.#events.sort(this.#sortEvents(sortType));
    this.#clearEventList();
    this.#renderEventsBoard();
  };

  #sortEvents = (sortType) => {
    switch (sortType) {
      case SortType.DATE_UP :
        this.#events.sort(sortByDate);
        break;
      case SortType.TIME_UP:
        this.#events.sort(sortByTime);
        break;
      case SortType.PRICE_UP:
        this.#events.sort(sortByPrice);
        break;
      default:
        throw new Error(`Неизвестный тип сортировки: '${sortType}'!`);
    }
  };

  #renderFilter = () => {
    render(this.#filterComponent, this.#filterContainer);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#eventsContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(
      this.#eventsComponent.element, this.#offers, this.#destinations,
      this.#handleEventChange, this.#handleModeChange
    );

    eventPresenter.init(event);
    this.#eventPresenter.set(event.id, eventPresenter);
  };

  #renderEvents = () => {
    render(this.#eventsComponent, this.#eventsContainer);

    this.#events.forEach((event) => {
      this.#renderEvent(event);
    });
  };

  #clearEventList = () => {
    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();
    remove(this.#eventsComponent);
  };

  #renderNoEvents = () => {
    render(this.#noEventsComponent, this.#eventsContainer);
  };

  #renderEventsBoard = () => {
    if (!this.#events.length) {
      this.#renderNoEvents();
    } else {
      this.#renderSort();
      this.#renderEvents();
    }
  };
}

import { render, remove } from '../framework/render';

import { SortType, UpdateType, UserAction } from '../const';

import { generateFilter } from '../mock/filter';

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

  #offers = null;
  #destinations = null;
  #filter = null;

  #filterComponent = null;
  #sortComponent = null;
  #eventsComponent = new EventsListView();
  #noEventsComponent = new noEventsView();

  #eventPresenter = new Map();
  #currentSortType = SortType.DATE_UP;

  constructor(filterContainer, eventsContainer, eventsModel, offersModel, destinationsModel) {
    this.#filterContainer = filterContainer;
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#offers = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#filter = generateFilter(this.events);
    this.#filterComponent = new FilterView(this.#filter);

    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  get events() {
    switch (this.#currentSortType) {
      case SortType.DATE_UP:
        return [...this.#eventsModel.events].sort(sortByDate);
      case SortType.TIME_UP:
        return [...this.#eventsModel.events].sort(sortByTime);
      case SortType.PRICE_UP:
        return [...this.#eventsModel.events].sort(sortByPrice);
      default:
        return this.#eventsModel.events;
    }
  }

  init = () => {
    this.#renderFilter();
    this.#renderEventsBoard();
  };

  #handleModeChange = () => {
    this.#eventPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, update);
        break;
      default:
        throw new Error('Неизвестное пользовательское действие');
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearEventsBoard();
        this.#renderEventsBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearEventsBoard();
        this.#renderEventsBoard();
        break;
      default:
        throw new Error('Неизвестный тип обновления');
    }
  };

  #handleSortTypeChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearEventsBoard();
    this.#renderEventsBoard();
  };

  #renderFilter = () => {
    render(this.#filterComponent, this.#filterContainer);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#eventsContainer);
  };

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(
      this.#eventsComponent.element, this.#offers, this.#destinations,
      this.#handleViewAction, this.#handleModeChange
    );

    eventPresenter.init(event);
    this.#eventPresenter.set(event.id, eventPresenter);
  };

  #renderEvents = () => {
    render(this.#eventsComponent, this.#eventsContainer);

    this.events.forEach((event) => this.#renderEvent(event));
  };

  #renderNoEvents = () => {
    render(this.#noEventsComponent, this.#eventsContainer);
  };

  #renderEventsBoard = () => {
    if (!this.events.length) {
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    this.#renderEvents();
  };

  #clearEventsBoard = () => {
    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();
    remove(this.#sortComponent);
    remove(this.#eventsComponent);

    this.currentSortType = SortType.DATE_UP;
  };
}

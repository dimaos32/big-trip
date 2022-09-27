import { render, remove } from '../framework/render';

import { FilterType, SortType, UpdateType, UserAction } from '../const';

import { sortByDate, sortByTime, sortByPrice } from '../utils/event';
import { filter } from '../utils/filter';

import FilterPresenter from '../presenter/filter-presenter.js';
import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import noEventsView from '../view/no-events-view';
import LoadingView from '../view/loading-view.js';
import EventPresenter from './event-presenter';
import EventNewPresenter from './event-new-presenter';

export default class EventsPresenter {
  #filterContainer = null;
  #eventsContainer = null;

  #filterModel = null;
  #eventsModel = null;

  #filterPresenter = null;
  #sortComponent = null;
  #eventsComponent = new EventsListView();
  #noEventsComponent = null;
  #loadingComponent = new LoadingView();

  #currentFilterType = FilterType.EVERYTHING;
  #currentSortType = SortType.DATE_UP;
  #eventPresenter = new Map();
  #eventNewPresenter = null;
  #isLoading = true;

  constructor(filterContainer, eventsContainer, filterModel, eventsModel) {
    this.#filterContainer = filterContainer;
    this.#eventsContainer = eventsContainer;
    this.#filterModel = filterModel;
    this.#eventsModel = eventsModel;
    this.#filterPresenter = new FilterPresenter(this.#filterContainer, this.#filterModel, this.#eventsModel);

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get events() {
    this.#currentFilterType = this.#filterModel.filter;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[this.#currentFilterType](events);

    switch (this.#currentSortType) {
      case SortType.DATE_UP:
        return filteredEvents.sort(sortByDate);
      case SortType.TIME_UP:
        return filteredEvents.sort(sortByTime);
      case SortType.PRICE_UP:
        return filteredEvents.sort(sortByPrice);
      default:
        return filteredEvents;
    }
  }

  init = () => {
    this.#renderFilter();
    this.#renderEventsBoard();
  };

  createEvent = (callback) => {
    this.#eventNewPresenter = new EventNewPresenter(
      this.#eventsComponent.element, this.#eventsModel.offers,
      this.#eventsModel.destinations, this.#handleViewAction
    );

    this.#currentSortType = SortType.DATE_UP;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this.#eventNewPresenter.init(callback);
  };

  #handleModeChange = () => {
    if (this.#eventNewPresenter) {
      this.#eventNewPresenter.destroy();
    }

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
      case UserAction.REMOVE_EVENT:
        this.#eventsModel.removeEvent(updateType, update);
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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
    this.#filterPresenter.init();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#eventsContainer);
  };

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(
      this.#eventsComponent.element, this.#eventsModel.offers, this.#eventsModel.destinations,
      this.#handleViewAction, this.#handleModeChange
    );

    eventPresenter.init(event);
    this.#eventPresenter.set(event.id, eventPresenter);
  };

  #renderEvents = () => {
    render(this.#eventsComponent, this.#eventsContainer);

    this.events.forEach(this.#renderEvent);
  };

  #renderNoEvents = () => {
    this.#noEventsComponent = new noEventsView(this.#currentFilterType);
    render(this.#noEventsComponent, this.#eventsContainer);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#eventsContainer, 'afterbegin');
  };

  #renderEventsBoard = () => {
    if (this.#isLoading) {
      this.#renderEvents();
      this.#renderLoading();
      return;
    }

    if (!this.events.length) {
      this.#renderEvents();
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    this.#renderEvents();
  };

  #clearEventsBoard = () => {
    if (this.#eventNewPresenter) {
      this.#eventNewPresenter.destroy();
    }

    this.#eventPresenter.forEach((presenter) => presenter.destroy());
    this.#eventPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noEventsComponent) {
      remove(this.#noEventsComponent);
    }

    this.#currentSortType = SortType.DATE_UP;
  };
}

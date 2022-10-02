import { RenderPosition, render, remove } from '../framework/render';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

import { FilterType, SortType, UpdateType, UserAction, TimeLimit } from '../const';

import { sortByDate, sortByTime, sortByPrice } from '../utils/event';
import { filter } from '../utils/filter';

import TripInfoPresenter from './trip-info-presenter.js';
import FilterPresenter from '../presenter/filter-presenter.js';
import SortView from '../view/sort-view';
import EventsListView from '../view/events-list-view';
import noEventsView from '../view/no-events-view';
import LoadingView from '../view/loading-view.js';
import EventPresenter from './event-presenter';
import EventNewPresenter from './event-new-presenter';

export default class EventsPresenter {
  #tripInfoContainer = null;
  #filterContainer = null;
  #eventsContainer = null;

  #filterModel = null;
  #eventsModel = null;

  #tripInfoPresenter = null;
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
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(tripInfoContainer, filterContainer, eventsContainer, filterModel, eventsModel) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#filterContainer = filterContainer;
    this.#eventsContainer = eventsContainer;
    this.#filterModel = filterModel;
    this.#eventsModel = eventsModel;
    this.#tripInfoPresenter = new TripInfoPresenter(this.#tripInfoContainer, this.#eventsModel);
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
    this.#renderTripInfo();
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenter.get(update.id).setSaving();

        try {
          await this.#eventsModel.updateEvent(updateType, update);
        } catch(err) {
          this.#eventPresenter.get(update.id).setAborting();
        }

        break;

      case UserAction.ADD_EVENT:
        this.#eventNewPresenter.setSaving();

        try {
          await this.#eventsModel.addEvent(updateType, update);
        } catch(err) {
          this.#eventNewPresenter.setAborting();
        }

        break;

      case UserAction.REMOVE_EVENT:
        this.#eventPresenter.get(update.id).setDeleting();

        try {
          await this.#eventsModel.removeEvent(updateType, update);
        } catch(err) {
          this.#eventPresenter.get(update.id).setAborting();
        }

        break;

      default:
        throw new Error('Unknown user action');
    }

    this.#uiBlocker.unblock();
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
        throw new Error('Unknown update type');
    }
  };

  #handleSortTypeChange = (sortType) => {
    this.#clearEventsBoard();
    this.#currentSortType = sortType;
    this.#renderEventsBoard();
  };

  #renderTripInfo = () => {
    this.#tripInfoPresenter.init();
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
    render(this.#loadingComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderEventsBoard = () => {
    if (this.#isLoading) {
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

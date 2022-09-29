import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

import { RenderPosition, render, remove } from '../framework/render';

import { EventEditViewMode, UserAction, UpdateType } from '../const';

import { isEscEvent } from '../utils/common';

import EventEditView from '../view/event-edit-view';

export default class EventNewPresenter {
  #eventsContainer = null;
  #offers = null;
  #destinations = null;
  #changeData = null;

  #eventEditComponent = null;
  #destroyCallback = null;

  #event = null;

  constructor(eventsContainer, offers, destinations, changeData) {
    this.#eventsContainer = eventsContainer;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#changeData = changeData;

    this.#event = {
      basePrice: 0,
      destination: null,
      isFavorite: false,
      offers: [],
      type: this.#offers ? this.#offers[0].type : 'taxi',
      dateFrom: new Date(dayjs().valueOf()),
      dateTo: new Date(dayjs().add(1, 'hours').valueOf()),
    };
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#eventEditComponent !== null) {
      return;
    }

    this.#eventEditComponent = new EventEditView(
      this.#event, this.#offers, this.#destinations, EventEditViewMode.ADD,
    );

    this.#eventEditComponent.setCancelEditClickHandler(this.#handleCancelEditClick);
    this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    render(this.#eventEditComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#eventEditComponent === null) {
      return;
    }

    if (this.#destroyCallback) {
      this.#destroyCallback();
    }

    remove(this.#eventEditComponent);
    this.#eventEditComponent = null;
  };

  #escKeyDownHandler = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleCancelEditClick = () => {
    this.destroy();
  };

  #handleFormSubmit = (event) => {
    this.#changeData(
      UserAction.ADD_EVENT,
      UpdateType.MAJOR,
      event,
    );
    this.destroy();
  };
}

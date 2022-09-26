import { render, remove } from '../framework/render';

import {nanoid} from 'nanoid';

import { getOffersByType} from '../mock/offers-by-type';

import { EventEditViewMode, UserAction, UpdateType } from '../const';

import { isEscEvent } from '../utils/common';

import EventEditView from '../view/event-edit-view';

export default class EventNewPresenter {
  #eventsContainer = null;
  #offers = null;
  #destinations = null;
  #changeData = null;

  #offersByType = getOffersByType();

  #eventEditComponent = null;
  #destroyCallback = null;

  #event = null;

  constructor(eventsContainer, offers, destinations, changeData) {
    this.#event = {
      basePrice: 0,
      destination: null,
      isFavorite: false,
      offers: [],
      type: this.#offersByType[0].type,
    };

    this.#eventsContainer = eventsContainer;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#eventEditComponent !== null) {
      return;
    }

    this.#eventEditComponent = new EventEditView(
      this.#event, this.#offers, this.#destinations, this.#offersByType,
      EventEditViewMode.ADD,
    );

    this.#eventEditComponent.setCancelEditClickHandler(this.#handleCancelEditClick);
    this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    render(this.#eventEditComponent, this.#eventsContainer, 'afterbegin');

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
      {id: nanoid(), ...event},
    );
    this.destroy();
  };
}

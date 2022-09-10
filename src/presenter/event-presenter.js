import { render, replace } from '../framework/render';

import { isEscEvent } from '../utils/common';

import EventEditView from '../view/event-edit-view';
import EventView from '../view/event-view';

export default class EventPresenter {
  #eventsContainer = null;
  #events = null;
  #offers = null;
  #offersByType = null;
  #destinations = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #event = null;

  constructor(eventsContainer, events, offers, offersByType, destinations) {
    this.#eventsContainer = eventsContainer;
    this.#events = events;
    this.#offers = offers;
    this.#offersByType = offersByType;
    this.#destinations = destinations;
  }

  init = (event) => {
    this.#event = event;

    this.#eventComponent = new EventView(this.#event, this.#offers, this.#destinations);
    this.#eventEditComponent = new EventEditView(this.#event, this.#offers, this.#destinations, this.#offersByType);

    this.#eventComponent.setEditClickHandler(this.#handleEditClick);
    this.#eventEditComponent.setCancelEditClickHandler(this.#handleCancelEditClick);
    this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    render(this.#eventComponent, this.#eventsContainer);
  };

  #activateEditEvent = () => {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #deactivateEditEvent = () => {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.#deactivateEditEvent();
    }
  };

  #handleEditClick = () => {
    this.#activateEditEvent();
  };

  #handleCancelEditClick = () => {
    this.#deactivateEditEvent();
  };

  #handleFormSubmit = () => {
    this.#deactivateEditEvent();
  };
}

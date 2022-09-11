import { render, replace, remove } from '../framework/render';

import { isEscEvent } from '../utils/common';

import EventEditView from '../view/event-edit-view';
import EventView from '../view/event-view';

export default class EventPresenter {
  #eventsContainer = null;
  #events = null;
  #offers = null;
  #offersByType = null;
  #destinations = null;
  #changeData = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #event = null;

  constructor(eventsContainer, events, offers, offersByType, destinations, changeData) {
    this.#eventsContainer = eventsContainer;
    this.#events = events;
    this.#offers = offers;
    this.#offersByType = offersByType;
    this.#destinations = destinations;
    this.#changeData = changeData;
  }

  init = (event) => {
    this.#event = event;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new EventView(this.#event, this.#offers, this.#destinations);
    this.#eventEditComponent = new EventEditView(this.#event, this.#offers, this.#destinations, this.#offersByType);

    this.#eventComponent.setEditClickHandler(this.#handleEditClick);
    this.#eventComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#eventEditComponent.setCancelEditClickHandler(this.#handleCancelEditClick);
    this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#eventsContainer);
      return;
    }

    if (this.#eventsContainer.contains(prevEventComponent.element)) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#eventsContainer.contains(prevEventEditComponent.element)) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  };

  destroy = () => {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
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

  #handleFavoriteClick = () => {
    this.#changeData({...this.#event, isFavorite: !this.#event.isFavorite});
  };

  #handleCancelEditClick = () => {
    this.#deactivateEditEvent();
  };

  #handleFormSubmit = (event) => {
    this.#changeData(event);
    this.#deactivateEditEvent();
  };
}

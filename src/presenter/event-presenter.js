import { render, replace, remove } from '../framework/render';

import { EventEditViewMode, UserAction, UpdateType } from '../const';

import { isEscEvent } from '../utils/common';

import EventEditView from '../view/event-edit-view';
import EventView from '../view/event-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {
  #eventsContainer = null;
  #offers = null;
  #destinations = null;
  #changeData = null;
  #changeMode = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #event = null;
  #mode = Mode.DEFAULT;

  constructor(eventsContainer, offers, destinations, changeData, changeMode) {
    this.#eventsContainer = eventsContainer;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (event) => {
    this.#event = event;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new EventView(this.#event, this.#offers, this.#destinations);
    this.#eventEditComponent = new EventEditView(
      this.#event, this.#offers, this.#destinations, EventEditViewMode.EDIT,
    );

    this.#eventComponent.setEditClickHandler(this.#handleEditClick);
    this.#eventComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#eventEditComponent.setDeleteEventHandler(this.#handleEventDeleteClick);
    this.#eventEditComponent.setCancelEditClickHandler(this.#handleCancelEditClick);
    this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#eventsContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventComponent, prevEventEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#eventEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#eventEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#eventComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#eventEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#eventEditComponent.shake(resetFormState);
  };

  destroy = () => {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#eventEditComponent.reset(this.#event);
      this.#deactivateEditEvent();
    }
  };

  #activateEditEvent = () => {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);

    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #deactivateEditEvent = () => {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.#eventEditComponent.reset(this.#event);
      this.#deactivateEditEvent();
    }
  };

  #handleEditClick = () => {
    this.#activateEditEvent();
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      {...this.#event, isFavorite: !this.#event.isFavorite},
    );
  };

  #handleEventDeleteClick = (update) => {
    this.#changeData(
      UserAction.REMOVE_EVENT,
      UpdateType.MINOR,
      update,
    );
  };

  #handleCancelEditClick = () => {
    this.#eventEditComponent.reset(this.#event);
    this.#deactivateEditEvent();
  };

  #handleFormSubmit = (update) => {
    this.#changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.MAJOR,
      update,
    );
  };
}

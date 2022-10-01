import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import dayjs from 'dayjs';

import { EventEditViewMode, BtnActiveValue } from '../const';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const getBtnValue = (isActive, value) => {
  const target = Object.keys(BtnActiveValue).find((el) => el === value);

  if (target) {
    return isActive ? `${BtnActiveValue[target]}...` : target;
  }

  return value;
};

const createEventEditFormTemplate = (event, offersData, destinationsData, mode) => {
  const { basePrice, destination, id, offers, type, isDisabled, isSaving, isDeleting, isSubmitDisabled} = event;

  const currentDestination = destinationsData.find((el) => (el.id === destination));
  const description = currentDestination ? currentDestination.description : '';
  const name = currentDestination ? currentDestination.name : '';
  const pictures = currentDestination ? currentDestination.pictures : [];

  const targetType = offersData.find((el) => (el.type === type));

  const generateOffersSection = () => {
    const data = targetType ? targetType.offers : [];

    const itemsMarkup = data
      .map((offer) => {
        const { id: offerId, title, price } = offer;
        const isChecked = offers.includes(offerId);

        return (`
          <div class="event__offer-selector">
            <input
              class="event__offer-checkbox  visually-hidden"
              id="${id}-${offerId}"
              data-event-offer-id="${offerId}"
              type="checkbox"
              name="event-offer-${title.replace(/\s/g, '-').toLowerCase()}"
              ${isChecked ? 'checked' : ''}
              ${isDisabled ? 'disabled' : ''}
            >
            <label class="event__offer-label" for="${id}-${offerId}">
              <span class="event__offer-title">${title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${price}</span>
            </label>
          </div>
        `);
      })
      .join('');

    return data.length
      ? (`
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${itemsMarkup}
            </div>
          </section>
        `)
      : '';
  };

  const generateDestinationSection = (data) => {
    const itemsMarkup = data.reduce((acc, picture) => {
      const { src, description: altText} = picture;

      return (`
        ${acc}
        <img class="event__photo" src="${src}" alt="${altText}">
      `);
    }, '');

    return description || data.length
      ? (`
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            ${description ? `<p class="event__destination-description">${description}</p>` : ''}


            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${itemsMarkup}
              </div>
            </div>
          </section>
        `)
      : '';
  };

  const generateEventTypesListMarkup = () => {
    const itemsMarkup = offersData
      .map((eventType) => {
        const isChecked = eventType.type === type;

        return (`
          <div class="event__type-item">
            <input id="event-type-${eventType.type}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType.type}" ${isChecked ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--${eventType.type}" for="event-type-${eventType.type}">${eventType.type}</label>
          </div>
        `);
      })
      .join('');

    return (`
      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${itemsMarkup}
        </fieldset>
      </div>
    `);
  };

  const generateEventDestinationOptions = () => {
    const destinationOptions = destinationsData
      .map((destinationOption) => `<option value="${destinationOption.name}"></option>`)
      .join('');

    return (`
      <datalist id="destination-list-${id}">
        ${destinationOptions}
      </datalist>
    `);
  };

  return (
    `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input
            class="event__type-toggle visually-hidden"
            id="event-type-toggle-${id}"
            type="checkbox"
            ${isDisabled ? 'disabled' : ''}
          >

          ${generateEventTypesListMarkup()}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${type[0].toUpperCase()}${type.slice(1)}
          </label>
          <input
            class="event__input  event__input--destination"
            id="event-destination-${id}"
            type="text"
            name="event-destination"
            value="${he.encode(name)}"
            list="destination-list-${id}"
            ${isDisabled ? 'disabled' : ''}
          >
          ${generateEventDestinationOptions()}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input
            class="event__input event__input--time"
            id="event-start-time-${id}"
            type="text"
            name="event-start-time"
            ${isDisabled ? 'disabled' : ''}
          >
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input
            class="event__input event__input--time"
            id="event-end-time-${id}"
            type="text"
            name="event-end-time"
            ${isDisabled ? 'disabled' : ''}
          >
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input
            class="event__input event__input--price"
            id="event-price-${id}"
            type="number"
            name="event-price"
            value="${basePrice}"
            ${isDisabled ? 'disabled' : ''}
          >
        </div>

        <button
          class="event__save-btn btn btn--blue"
          type="submit"
          ${isDisabled || isSubmitDisabled ? 'disabled' : ''}
        >
          ${getBtnValue(isSaving, 'Save')}
        </button>
        ${mode === EventEditViewMode.ADD ? '<button class="event__reset-btn  btn" type="reset">Cancel</button>' : ''}
        ${mode === EventEditViewMode.EDIT ? `<button
          class="event__delete-btn btn"
          type="button"
          ${isDisabled ? 'disabled' : ''}
        >${getBtnValue(isDeleting, 'Delete')}</button>` : ''}
        ${mode === EventEditViewMode.EDIT ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : ''}
      </header>
      <section class="event__details">
        ${generateOffersSection()}
        ${generateDestinationSection(pictures)}
      </section>
    </form>`
  );
};

export default class EventEditView extends AbstractStatefulView {
  #offers = null;
  #destinations = null;
  #mode = null;

  #datepickerFrom = null;
  #datepickerTo = null;

  constructor(event, offers, destinations, mode) {
    super();
    this._state = EventEditView.parseEventToState(event);
    this.#offers = offers;
    this.#destinations = destinations;
    this.#mode = mode;

    this.#setInnerHandlers();
    this.#setDatepickers();
    this.#setSaveBtnState();
  }

  get template() {
    return createEventEditFormTemplate(this._state, this.#offers, this.#destinations, this.#mode);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  reset = (event) => {
    this.updateElement(
      EventEditView.parseEventToState(event),
    );
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatepickers();
    this.setDeleteEventHandler(this._callback.deleteClick);
    this.setCancelEditClickHandler(this._callback.click);
    this.setFormSubmitHandler(this._callback.formSubmit);
  };

  setDeleteEventHandler = (callback) => {
    this._callback.deleteClick = callback;

    this.element.querySelector('.event__delete-btn')
      ?.addEventListener('click', this.#deleteEventHandler);
  };

  setCancelEditClickHandler = (callback) => {
    this._callback.click = callback;

    this.element.querySelector('.event__reset-btn')
      ?.addEventListener('click', this.#clickHandler);
    this.element.querySelector('.event__rollup-btn')
      ?.addEventListener('click', this.#clickHandler);
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.addEventListener('submit', this.#submitHandler);
  };

  #deleteEventHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EventEditView.parseStateToEvent(this._state));
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(this._state);
  };

  #availableOffersToggleHandler = ({ target }) => {
    const availableOffers = [...this._state.offers];
    const index = this._state.offers.indexOf(Number(target.dataset.eventOfferId));

    if (index !== -1) {
      availableOffers.splice(index, 1);
    } else {
      availableOffers.push(Number(target.dataset.eventOfferId));
    }

    this._setState({
      offers: [...availableOffers],
    });
  };

  #eventTypeChangeHandler = ({ target }) => {
    this.updateElement({
      type: target.value,
      offers: [],
    });
  };

  #eventDestinationChangeHandler = ({ target }) => {
    const newDestination = this.#destinations.find((el) => el.name === target.value);

    if (newDestination) {
      this.updateElement({
        destination: newDestination.id,
      });
    }

    this.#setSaveBtnState();
  };

  #dateFromChangeHandler = ([newDate]) => {
    this._setState({
      dateFrom: newDate,
    });
  };

  #dateToChangeHandler = ([newDate]) => {
    this._setState({
      dateTo: newDate,
    });
  };

  #eventPriceChangeHandler = ({ target }) => {
    if (target.value === '' || Number(target.value) < 0) {
      target.value = '0';
    }

    this._setState({
      basePrice: Number(target.value),
    });

    this.#setSaveBtnState();
  };

  #setDatepickers = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('[name="event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      },
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('[name="event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        minDate: this.#datepickerFrom.selectedDates[0],
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
      },
    );

    this.#datepickerFrom.config.onChange.push(() => {
      this.#datepickerTo.set('minDate', this.#datepickerFrom.selectedDates[0]);

      if (dayjs(this.#datepickerFrom.selectedDates[0]).isAfter( dayjs(this.#datepickerTo.selectedDates[0]))) {
        this.#datepickerTo.setDate(this.#datepickerFrom.selectedDates[0]);
      }
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__available-offers')
      ?.addEventListener('change', this.#availableOffersToggleHandler);
    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#eventTypeChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#eventDestinationChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#eventPriceChangeHandler);
  };

  #setSaveBtnState = () => {
    const destinationElement = this.element.querySelector('.event__input--destination');
    const priceElement = this.element.querySelector('.event__input--price');
    const saveBtnElement = this.element.querySelector('.event__save-btn');

    this._setState({
      isSubmitDisabled: (!destinationElement.value || Number(priceElement.value) <= 0),
    });

    saveBtnElement.disabled = this._state.isDisabled || this._state.isSubmitDisabled;
  };

  static parseEventToState = (event) => ({
    ...event,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
    isSubmitDisabled: false,
  });

  static parseStateToEvent = (state) => {
    const event = {...state};

    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;
    delete event.isSubmitDisabled;

    return event;
  };
}

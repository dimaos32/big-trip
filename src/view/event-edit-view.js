import AbstractStatefulView from '../framework/view/abstract-stateful-view';

import { EventEditViewMode } from '../const';
import { getEventTypes } from '../mock/event-types';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createEventEditFormTemplate = (event, offersData, destinationsData, offersByTypeData, mode) => {
  const { basePrice, destination, id, offers, type } = event;

  const currentDestination = destinationsData.find((el) => (el.id === destination));
  const description = currentDestination ? currentDestination.description : '';
  const name = currentDestination ? currentDestination.name : '';
  const pictures = currentDestination ? currentDestination.pictures : [];

  const offersByType = offersByTypeData.find((offer) => offer.type === event.type) || [];

  const { offers: currentOfferIds = [] } = offersByType;

  const currentOffers = offersData.filter((offer) => currentOfferIds.includes(offer.id));
  const eventTypes = getEventTypes();

  const generateOffersMarkup = (data) => {
    const itemsMarkup = data
      .map((offer) => {
        const { id: offerId, title, price } = offer;
        const isChecked = offers.includes(offerId);

        return (`
          <div class="event__offer-selector">
            <input
              class="event__offer-checkbox  visually-hidden"
              id="event-offer-${offerId}"
              data-event-offer-id="${offerId}"
              type="checkbox"
              name="event-offer-luggage"
              ${isChecked ? 'checked' : ''}
            >
            <label class="event__offer-label" for="event-offer-${offerId}">
              <span class="event__offer-title">${title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${price}</span>
            </label>
          </div>
        `);
      })
      .join('');

    return (`
      <div class="event__available-offers">
        ${itemsMarkup}
      </div>
    `);
  };

  const generatePhotosMarkup = (data) => {
    const itemsMarkup = data.reduce((acc, picture) => {
      const { src, description: altText} = picture;

      return (`
        ${acc}
        <img class="event__photo" src="${src}" alt="${altText}">
      `);
    }, '');

    return (`
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${itemsMarkup}
        </div>
      </div>
    `);
  };

  const generateEventTypesListMarkup = (data) => {
    const itemsMarkup = data
      .map((eventType) => {
        const isChecked = eventType === type;

        return (`
          <div class="event__type-item">
            <input id="event-type-${eventType}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${isChecked ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}">${eventType}</label>
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
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          ${generateEventTypesListMarkup(eventTypes)}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${type[0].toUpperCase()}${type.slice(1)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${name}" list="destination-list-${id}">
          ${generateEventDestinationOptions()}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        ${mode === EventEditViewMode.ADD ? '<button class="event__reset-btn" type="reset">Cancel</button>' : ''}
        ${mode === EventEditViewMode.EDIT ? '<button class="event__delete-btn" type="button">Delete</button>' : ''}
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          ${generateOffersMarkup(currentOffers)}
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>

          ${generatePhotosMarkup(pictures)}
        </section>
      </section>
    </form>`
  );
};

export default class EventEditView extends AbstractStatefulView {
  #offers = null;
  #destinations = null;
  #offersByType = null;
  #mode = null;

  #datepickerFrom = null;
  #datepickerTo = null;

  #saveBtnElement = null;

  constructor(event, offers, destinations, offersByType, mode) {
    super();
    this._state = EventEditView.parseEventToState(event);
    this.#offers = offers;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#mode = mode;

    this.#setInnerHandlers();
    this.#setDatepickers();
    this.#setSaveBtnState();
  }

  get template() {
    return createEventEditFormTemplate(this._state, this.#offers, this.#destinations, this.#offersByType, this.#mode);
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
    this.setCancelEditClickHandler(this._callback.click);
    this.setFormSubmitHandler(this._callback.formSubmit);
  };

  setCancelEditClickHandler = (callback) => {
    this._callback.click = callback;

    if (this.element.querySelector('.event__reset-btn')) {
      this.element.querySelector('.event__reset-btn')
        .addEventListener('click', this.#clickHandler);
    }
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.addEventListener('submit', this.#submitHandler);
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
    });
  };

  #eventDestinationChangeHandler = ({ target }) => {
    const newDestination = this.#destinations.find((el) => el.name === target.value);
    const saveBtnElement = this.element.querySelector('.event__save-btn');

    if (newDestination) {
      this.updateElement({
        destination: newDestination.id,
      });

      saveBtnElement.disabled = false;
    } else {
      saveBtnElement.disabled = true;
    }
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
    if (target.value === '') {
      target.value = '0';
    }

    this._setState({
      basePrice: Number(target.value),
    });
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
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
      },
    );
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#availableOffersToggleHandler);
    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#eventTypeChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#eventDestinationChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#eventPriceChangeHandler);
  };

  #setSaveBtnState = () => {
    const destinationElement = this.element.querySelector('.event__input--destination');
    const saveBtnElement = this.element.querySelector('.event__save-btn');

    if (!destinationElement.value) {
      saveBtnElement.disabled = true;
    }
  };

  static parseEventToState = (event) => ({
    ...event,
  });

  static parseStateToEvent = (state) => {
    const event = {...state};

    return event;
  };
}

import AbstractStatefulView from '../framework/view/abstract-stateful-view';

import { humanizeDateAndTime } from '../utils/event';
import { getEventTypes } from '../mock/event-types';

const createEventEditFormTemplate = (event, offersData, destinationsData, offersByTypeData) => {
  const { basePrice, humanizedDateFrom, humanizedDateTo, destination, offers, type } = event;
  const { description, name, pictures } = destinationsData.find((el) => (el.id === destination));

  const { offers: currentOfferIds } = offersByTypeData.find((offer) => offer.type === event.type);

  const currentOffers = offersData.filter((offer) => currentOfferIds.includes(offer.id));
  const eventTypes = getEventTypes();

  const generateOffersMarkup = (data) => {
    const itemsMarkup = data
      .map((offer) => {
        const { id, title, price } = offer;
        const isChecked = offers.includes(id);

        return (`
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" data-event-offer-id="${id}" type="checkbox" name="event-offer-luggage" ${isChecked ? 'checked' : ''}>
            <label class="event__offer-label" for="event-offer-${id}">
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

  return (
    `<form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          ${generateEventTypesListMarkup(eventTypes)}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type[0].toUpperCase()}${type.slice(1)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizedDateFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizedDateTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
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

  #element = null;

  constructor(event, offers, destinations, offersByType) {
    super();
    this._state = EventEditView.parseEventToState(event);
    this.#offers = offers;
    this.#destinations = destinations;
    this.#offersByType = offersByType;

    this.#setInnerHandlers();
  }

  get template() {
    return createEventEditFormTemplate(this._state, this.#offers, this.#destinations, this.#offersByType);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCancelEditClickHandler(this._callback.click);
    this.setFormSubmitHandler(this._callback.formSubmit);
  };

  setCancelEditClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#clickHandler);
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

  #availableToggleHandler = ({ target }) => {
    const index = this._state.offers.indexOf(Number(target.dataset.eventOfferId));

    if (index !== -1) {
      this._state.offers.splice(index, 1);
      return;
    }

    this._state.offers.push(Number(target.dataset.eventOfferId));
    this._state.offers.sort((a, b) => a - b);

    console.log(this._state.offers);
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#availableToggleHandler);

  };

  static parseEventToState = (event) => ({
    ...event,
    humanizedDateFrom: humanizeDateAndTime(event.dateFrom),
    humanizedDateTo: humanizeDateAndTime(event.dateTo),
  });

  static parseStateToEvent = (state) => {
    const event = {...state};

    delete event.humanizedDateFrom;
    delete event.humanizedDateTo;

    return event;
  };
}

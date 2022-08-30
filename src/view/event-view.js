import AbstractView from '../framework/view/abstract-view';

import { humanizeEventDate, humanizeEventtime, getTimeDuration } from '../utils/event';

const createEventTemplate = (event, offersData, destinationsData) => {
  const { basePrice, dateFrom, dateTo, destination, isFavorite, offers, type } = event;

  const humanizedDateFrom = humanizeEventDate(dateFrom);
  const humanizedTimeFrom = humanizeEventtime(dateFrom);
  const humanizedTimeTo = humanizeEventtime(dateTo);

  const name = destinationsData.find((el) => (el.id === destination)).name;

  const favoriteBtnClass = `event__favorite-btn${isFavorite ? ' event__favorite-btn--active' : ''}`;

  const generateSelectedOffersListMarkup = (data) => {
    const itemsMarkup = data
      .map((offer) => {
        const selectedOffer = offersData.find((el) => (el.id === offer));
        const { title, price } = selectedOffer;

        return (`
          <li class="event__offer">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </li>
        `);
      })
      .join('');

    return (`
      <ul class="event__selected-offers">
        ${itemsMarkup}
      </ul>
    `);
  };

  return (
    `<div class="event">
      <time class="event__date" datetime="${dateFrom}">${humanizedDateFrom}</time>
      <div class="event__type">
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type[0].toUpperCase()}${type.slice(1)} ${name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom}">${humanizedTimeFrom}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTo}">${humanizedTimeTo}</time>
        </p>
        <p class="event__duration">${getTimeDuration(dateTo, dateFrom)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      ${generateSelectedOffersListMarkup(offers)}
      <button class="${favoriteBtnClass}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`
  );
};

export default class EventView extends AbstractView {
  #event = null;
  #offers = null;
  #destinations = null;

  #element = null;

  constructor(event, offers, destinations) {
    super();
    this.#event = event;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createEventTemplate(this.#event, this.#offers, this.#destinations);
  }

  setEditClickHandler = (callback) => {
    this._callback.click = callback;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}

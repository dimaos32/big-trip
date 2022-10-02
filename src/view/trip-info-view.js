import dayjs from 'dayjs';

import AbstractView from '../framework/view/abstract-view';

import { MAX_SHOWN_DESTINATIONS } from '../const';

import { humanizeEventDate, sortByDate } from '../utils/event';

const createSummaryBoardTemplate = (route, dates, tripPrice) => (`
  <section class="trip-main__trip-info trip-info" >
    <div class="trip-info__main">
      <h1 class="trip-info__title">${route}</h1>
      <p class="trip-info__dates">${dates}</p>
    </div>

    ${tripPrice
    ? (`
      <p class="trip-info__cost">
        Total: €&nbsp;<span class="trip-info__cost-value">${tripPrice}</span>
      </p>
    `)
    : ''}
  </section>`
);

export default class TripInfoView extends AbstractView {
  #events = null;
  #destinations = null;
  #offers = null;

  constructor(events, destinations, offers) {
    super();
    this.#events = events.sort(sortByDate);
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createSummaryBoardTemplate(this.route, this.dates, this.tripPrice);
  }

  get route() {
    if (!this.#events.length) {
      return 'Add your first event!';
    }

    if (this.#events.length > MAX_SHOWN_DESTINATIONS) {
      const firstDestination = this.#getDestination(this.#events[0].destination);
      const lastDestination = this.#getDestination(this.#events.at(-1).destination);

      return `${firstDestination} — ... — ${lastDestination}`;
    }

    return this.#events.map((el) => this.#getDestination(el.destination)).join(' — ');
  }

  get dates() {
    if (!this.#events.length) {
      return '';
    }

    const firstDate = humanizeEventDate(this.#events[0].dateFrom, true);
    const lastDate = humanizeEventDate(this.#events.at(-1).dateFrom, true);

    const isOneMonthDates = dayjs(firstDate, 'month').isSame(lastDate, 'month');

    if (this.#events.length > 1) {
      return isOneMonthDates ? `${firstDate} — ${dayjs(lastDate).date()}` : `${firstDate}  — ${lastDate}`;
    }

    return firstDate;
  }

  get tripPrice() {
    const eventTotalPrices = this.#events.map((event) => {
      const { type, offers } = event;
      const currentOffers = this.#offers.find((el) => el.type === type).offers;

      return offers.reduce((acc, offer) => {
        const currentOfferPrice = currentOffers.find((el) => el.id === offer).price;

        return acc + currentOfferPrice;
      }, event.basePrice);
    });

    return eventTotalPrices.reduce((acc, item) => acc + item, 0);
  }

  #getDestination = (id) => this.#destinations.find((el) => el.id === id).name;
}

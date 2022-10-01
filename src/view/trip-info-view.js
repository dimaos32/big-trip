import dayjs from 'dayjs';

import AbstractView from '../framework/view/abstract-view';

import { humanizeEventDate, sortByDate } from '../utils/event';

const createSummaryBoardTemplate = (events, destinations, tripPrice) => {
  const getDestination = (id) => destinations.find((el) => el.id === id).name;

  const getRoute = () => {
    if (!events.length) {
      return 'Add your first event!';
    }

    if (events.length > 3) {
      const firstDestination = getDestination(events[0].destination);
      const lastDestination = getDestination(events[events.length - 1].destination);

      return `${firstDestination} — ... — ${lastDestination}`;
    }

    return events.map((el) => getDestination(el.destination)).join(' — ');
  };

  const getDates = () => {
    if (!events.length) {
      return '';
    }

    const firstDate = humanizeEventDate(events[0].dateFrom, true);
    const lastDate = humanizeEventDate(events[events.length - 1].dateFrom, true);

    const isOneMonthDates = dayjs(firstDate, 'month').isSame(lastDate, 'month');

    if (events.length > 1) {
      return isOneMonthDates ? `${firstDate} — ${dayjs(lastDate).date()}` : `${firstDate}  — ${lastDate}`;
    }

    return firstDate;
  };

  return (`
    <section class="trip-main__trip-info trip-info" >
      <div class="trip-info__main">
        <h1 class="trip-info__title">${getRoute()}</h1>
        <p class="trip-info__dates">${getDates()}</p>
      </div>

      ${events.length
      ? (`
        <p class="trip-info__cost">
          Total: €&nbsp;<span class="trip-info__cost-value">${tripPrice}</span>
        </p>
      `)
      : ''}
    </section>`
  );
};

export default class TripInfoView extends AbstractView {
  #events = null;
  #destinations = null;
  #tripPrice = null;

  constructor(events, destinations, tripPrice) {
    super();
    this.#events = events;
    this.#destinations = destinations;
    this.#tripPrice = tripPrice;
  }

  get template() {
    return createSummaryBoardTemplate(this.#events.sort(sortByDate), this.#destinations, this.#tripPrice);
  }
}

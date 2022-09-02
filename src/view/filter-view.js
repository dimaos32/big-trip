import AbstractView from '../framework/view/abstract-view';
import { filter } from '../utils/filter';

const createFilterItemTemplate = (events, [filterName, filterTasks]) => (
  `<div class="trip-filters__filter">
    <input id="filter-${filterName}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value=${filterName} ${filterName === 'everything' && events.length ? 'checked' : ''} ${!filterTasks(events).length ? 'disabled' : ''} = >
    <label class="trip-filters__filter-label" for="filter-${filterName}">${filterName}</label>
  </div>`
);

const createFilterTemplate = (events) => {
  const itemsMarkup = Object.entries(filter)
    .map((el) => createFilterItemTemplate(events, el))
    .join('');

  return `<form class="trip-filters" action="#" method="get">
    ${itemsMarkup}
  </form>`;
};

export default class FilterView extends AbstractView {
  #events = null;

  constructor(events) {
    super();
    this.#events = events;
  }

  get template() {
    return createFilterTemplate(this.#events);
  }
}

import AbstractView from '../framework/view/abstract-view';

const createFilterItemTemplate = ({name, count}) => (
  `<div class="trip-filters__filter">
    <input
      id="filter-${name}"
      class="trip-filters__filter-input visually-hidden"
      type="radio" name="trip-filter"
      value=${name}
      ${name === 'everything' && count ? 'checked' : ''}
      ${!count ? 'disabled' : ''}
    >
    <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
  </div>`
);

const createFilterTemplate = (filter) => {
  const itemsMarkup = filter
    .map((el) => createFilterItemTemplate(el))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${itemsMarkup}
    </form>`
  );
};

export default class FilterView extends AbstractView {
  #filter = null;

  constructor(filter) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createFilterTemplate(this.#filter);
  }
}

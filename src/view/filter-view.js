import AbstractView from '../framework/view/abstract-view';

const createFilterItemTemplate = ({name, count}, currentFilterType) => (
  `<div class="trip-filters__filter">
    <input
      id="filter-${name}"
      class="trip-filters__filter-input visually-hidden"
      type="radio" name="trip-filter"
      value=${name}
      ${name === currentFilterType && count ? 'checked' : ''}
      ${!count ? 'disabled' : ''}
    >
    <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
  </div>`
);

const createFilterTemplate = (filter, currentFilterType) => {
  const itemsMarkup = filter
    .map((el) => createFilterItemTemplate(el, currentFilterType))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${itemsMarkup}
    </form>`
  );
};

export default class FilterView extends AbstractView {
  #filter = null;
  #currentFilter = null;

  constructor(filter, currentFilterType) {
    super();
    this.#filter = filter;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filter, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };
}

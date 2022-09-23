import AbstractView from '../framework/view/abstract-view';

import { SortType, SORT_TYPES } from '../const';

const createSortTemplate = (currentSortType) => {
  const itemsMarkup = SORT_TYPES
    .map((sortType) => {
      const { type, text, isEnabled } = sortType;

      return (
        `<div class="trip-sort__item  trip-sort__item--${type}">
          <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" ${currentSortType === `sort-${type}` ? 'checked' : ''} ${isEnabled ? '' : 'disabled'}>
          <label class="trip-sort__btn" for="sort-${type}">${text}</label>
        </div>`
      );
    })
    .join('');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${itemsMarkup}
    </form>`
  );
};

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType = SortType.DATE_UP) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.value);
  };
}

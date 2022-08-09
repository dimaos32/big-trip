import { render } from './render';

import FilterView from './view/filter-view';
import SortView from './view/sort-view';

import EventsPresenter from './presenter/eventsPresenter';

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls');
const tripFilterElement = tripControlsElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const eventsPresenter = new EventsPresenter();

render(new FilterView(), tripFilterElement);
render(new SortView(), tripEventsElement);

eventsPresenter.init(tripEventsElement);

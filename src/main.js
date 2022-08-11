import { render } from './render';

import FilterView from './view/filter-view';
import SortView from './view/sort-view';

import EventsPresenter from './presenter/events-presenter';
import EventsModel from './model/events-model';

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls');
const tripFilterElement = tripControlsElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const eventsPresenter = new EventsPresenter();
const eventsModel = new EventsModel();

render(new FilterView(), tripFilterElement);
render(new SortView(), tripEventsElement);

eventsPresenter.init(tripEventsElement, eventsModel);

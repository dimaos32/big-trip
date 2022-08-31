import { render } from './framework/render';

import FilterView from './view/filter-view';

import EventsPresenter from './presenter/events-presenter';
import EventsModel from './model/events-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls');
const tripFilterElement = tripControlsElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const eventsPresenter = new EventsPresenter();
const eventsModel = new EventsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

render(new FilterView(), tripFilterElement);

eventsPresenter.init(tripEventsElement, eventsModel, offersModel, destinationsModel);

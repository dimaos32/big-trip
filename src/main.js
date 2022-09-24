import EventsPresenter from './presenter/events-presenter';
import FilterModel from './model/filter-model.js';
import EventsModel from './model/events-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';

const siteHeaderElement = document.querySelector('.page-header');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls');
const tripFilterElement = tripControlsElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const filterModel = new FilterModel();
const eventsModel = new EventsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const eventsPresenter = new EventsPresenter(tripFilterElement, tripEventsElement, filterModel, eventsModel, offersModel, destinationsModel);

eventsPresenter.init();

import { render } from './framework/render';
import { AUTHORIZATION, END_POINT } from './const';
import NewEventButtonView from './view/new-event-button-view.js';
import EventsPresenter from './presenter/events-presenter';
import FilterModel from './model/filter-model.js';
import EventsModel from './model/events-model';
import EventsApiService from './events-api-service';

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripControlsElement = siteHeaderElement.querySelector('.trip-controls');
const tripFilterElement = tripControlsElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const newEventButtonComponent = new NewEventButtonView();
const filterModel = new FilterModel();
const eventsModel = new EventsModel(new EventsApiService(END_POINT, AUTHORIZATION));
const eventsPresenter = new EventsPresenter(tripMainElement, tripFilterElement, tripEventsElement, filterModel, eventsModel);

const handleNewEventFormClose = () => {
  newEventButtonComponent.element.disabled = false;
};

const handleNewEventButtonClick = () => {
  eventsPresenter.createEvent(handleNewEventFormClose);
  newEventButtonComponent.element.disabled = true;
};

eventsPresenter.init();
eventsModel.init()
  .finally(() => {
    render(newEventButtonComponent, tripMainElement);
    newEventButtonComponent.setClickHandler(handleNewEventButtonClick);
  });

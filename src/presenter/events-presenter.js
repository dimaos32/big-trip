import { RenderPosition, render } from '../render';
import { getOffersByType} from '../mock/offers-by-type';

import EventsListView from '../view/events-list-view';
import EventsItemView from '../view/events-item-view';
import EventEditFormView from '../view/event-edit-form-view';

import EventView from '../view/event-view';

const offersByType = getOffersByType();

export default class EventsPresenter {
  eventsComponent = new EventsListView();

  renderEventsItem = (content, place = RenderPosition.BEFOREEND) => {
    const itemElement = new EventsItemView();
    render(itemElement, this.eventsComponent.getElement(), place);
    render(content, itemElement.getElement());
  };

  init = (eventsContainer, eventsModel, offersModel, destinationsModel) => {
    this.eventsContainer = eventsContainer;
    this.eventsModel = eventsModel;
    this.offersModel = offersModel;
    this.destinationsModel = destinationsModel;
    this.events = [...this.eventsModel.getEvents()];
    this.offers = [...this.offersModel.getOffers()];
    this.destinations = [...this.destinationsModel.getDestinations()];

    render(this.eventsComponent, this.eventsContainer);
    this.renderEventsItem(new EventEditFormView(this.events[0], this.offers, this.destinations, offersByType), RenderPosition.AFTERBEGIN);

    this.events.forEach((event) => {
      this.renderEventsItem(new EventView(event, this.offers, this.destinations));
    });
  };
}

import { RenderPosition, render } from '../render';

import EventsListView from '../view/events-list-view';
import EventsItemView from '../view/events-item-view';
import EventEditFormView from '../view/event-edit-form-view';
import EventView from '../view/event-view';

export default class EventsPresenter {
  eventsComponent = new EventsListView();

  renderEventsItem = (content, place = RenderPosition.BEFOREEND) => {
    const itemElement = new EventsItemView();
    render(itemElement, this.eventsComponent.getElement(), place);
    render(content, itemElement.getElement());
  };

  init = (eventsContainer, eventsModel) => {
    this.eventsContainer = eventsContainer;
    this.eventsModel = eventsModel;
    this.events = [...this.eventsModel.getEvents()];

    render(this.eventsComponent, this.eventsContainer);
    this.renderEventsItem(new EventEditFormView(), RenderPosition.AFTERBEGIN);

    for (let i = 0; i < this.events.length; i++) {
      this.renderEventsItem(new EventView(this.events[i]));
    }
  };
}

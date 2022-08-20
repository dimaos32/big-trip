import { generateEvent } from '../mock/events';

export default class EventsModel {
  events = Array.from({length: 3}, generateEvent);

  getEvents = () => this.events;
}

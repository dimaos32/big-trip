import Observable from '../framework/observable';
import { UpdateType } from '../const';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #events = [];
  #destinations = [];
  #offers = [];

  constructor(eventsApiService) {
    super();
    this.#eventsApiService = eventsApiService;
  }

  get events() {
    return this.#events;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  init = async () => {
    try {
      const events = await this.#eventsApiService.events;
      this.#events = events.map(this.#adaptEventToClient);
    } catch(err) {
      this.#events = [];
    }

    try {
      const destinations = await this.#eventsApiService.destinations;
      this.#destinations = destinations.map(this.#adaptDestinationToClient);
    } catch(err) {
      this.#destinations = [];
    }

    try {
      const offers = await this.#eventsApiService.offers;
      this.#offers = offers.map(this.#adaptOffersToClient);
    } catch(err) {
      this.#offers = [];
    }

    this._notify(UpdateType.INIT);
  };

  updateEvent = (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Невозможно обновить несуществующее событие');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      update,
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addEvent = (updateType, update) => {
    this.#events = [
      update,
      ...this.#events,
    ];

    this._notify(updateType, update);
  };

  removeEvent = (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Невозможно удалить несуществующее событие');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      ...this.#events.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  #adaptEventToClient = (event) => {
    const adaptedEvent = {...event,
      basePrice: event['base_price'],
      dateFrom: event['date_from'] !== null ? new Date(event['date_from']) : event['date_from'],
      dateTo: event['date_to'] !== null ? new Date(event['date_to']) : event['date_to'],
      isFavorite: event['is_favorite'],
    };

    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  };

  #adaptDestinationToClient = (destination) => {
    const adaptedDestination = { ...destination };

    return adaptedDestination;
  };

  #adaptOffersToClient = (offer) => {
    const adaptedOffer = { ...offer };

    return adaptedOffer;
  };
}

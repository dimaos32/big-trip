import { RenderPosition, render, replace, remove } from '../framework/render';

import TripInfoView from '../view/trip-info-view';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #eventsModel = null;

  #tripInfoComponent = null;

  constructor(tripInfoContainer, eventsModel) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#eventsModel = eventsModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const events = this.#eventsModel.events;
    const destinations = this.#eventsModel.destinations;
    const tripPrice = this.#eventsModel.tripPrice;
    const prevtripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView(events, destinations, tripPrice);

    if (prevtripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevtripInfoComponent);
    remove(prevtripInfoComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };
}

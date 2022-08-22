import { getDestinations } from '../mock/destinations';

export default class DestinationsModel {
  #destinations = getDestinations();

  get destinations() {
    return this.#destinations;
  }
}

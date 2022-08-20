import { getDestinations as getData } from '../mock/destinations';

export default class DestinationsModel {
  destinations = getData();

  getDestinations = () => this.destinations;
}

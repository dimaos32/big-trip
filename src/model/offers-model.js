import { getOffers as getData } from '../mock/offers';

export default class OffersModel {
  offers = getData();

  getOffers = () => this.offers;
}

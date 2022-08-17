import { getOffersByType as getData } from '../mock/offers-by-type';

export default class OffersByTypeModel {
  offers = getData();

  getOffersByType = () => this.offers;
}

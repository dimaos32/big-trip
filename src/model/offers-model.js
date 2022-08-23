import { getOffers } from '../mock/offers';

export default class OffersModel {
  #offers = getOffers();

  get offers() {
    return this.#offers;
  }
}

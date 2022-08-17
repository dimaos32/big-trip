import { getRandomInteger } from './../utils';

const points = [
  {
    basePrice: 1100,
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: 1,
    id: '0',
    isFavorite: false,
    offers: [1],
    type: 'bus',
  },
  {
    basePrice: 1100,
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: 1,
    id: '0',
    isFavorite: false,
    offers: [3],
    type: 'bus',
  },
  {
    basePrice: 1100,
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: 1,
    id: '0',
    isFavorite: false,
    offers: [1, 3],
    type: 'bus',
  },
];

const generateEvent = () => points[getRandomInteger(0, 2)];

export { generateEvent };

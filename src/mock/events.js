import { getRandomInteger } from '../utils/common';
import { generatePeriod } from '../utils/event';
import { nanoid } from 'nanoid';

const points = [
  {
    basePrice: 1100,
    destination: 1,
    isFavorite: false,
    offers: [1],
    type: 'bus',
  },
  {
    basePrice: 1600,
    destination: 1,
    isFavorite: false,
    offers: [3],
    type: 'bus',
  },
  {
    basePrice: 1300,
    destination: 1,
    isFavorite: true,
    offers: [1, 3],
    type: 'bus',
  },
  {
    basePrice: 10,
    destination: 2,
    isFavorite: false,
    offers: [2],
    type: 'drive',
  },
  {
    basePrice: 40,
    destination: 2,
    isFavorite: true,
    offers: [4],
    type: 'drive',
  },
  {
    basePrice: 15,
    destination: 2,
    isFavorite: false,
    offers: [2, 4],
    type: 'drive',
  },
  {
    basePrice: 12,
    destination: 2,
    isFavorite: false,
    offers: [],
    type: 'drive',
  },
  {
    basePrice: 0,
    destination: 3,
    isFavorite: false,
    offers: [],
    type: 'check-in',
  },
  {
    basePrice: 0,
    destination: 4,
    isFavorite: false,
    offers: [],
    type: 'check-in',
  },
  {
    basePrice: 0,
    destination: 5,
    isFavorite: false,
    offers: [],
    type: 'check-in',
  },
  {
    basePrice: 0,
    destination: 6,
    isFavorite: true,
    offers: [],
    type: 'check-in',
  },
];

const generateEvent = () => {
  const period = generatePeriod();
  const event = points[getRandomInteger(0, points.length - 1)];

  event.id = nanoid();

  const dateFrom = period[0];
  const dateTo = period[1];

  return { ...event, dateFrom, dateTo };
};

export { generateEvent };

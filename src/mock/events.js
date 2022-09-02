import { getRandomInteger } from '../utils/common';
import { generatePeriod } from '../utils/event';

const points = [
  {
    basePrice: 1100,
    destination: 1,
    id: '0',
    isFavorite: false,
    offers: [1],
    type: 'bus',
  },
  {
    basePrice: 1100,
    destination: 1,
    id: '0',
    isFavorite: false,
    offers: [3],
    type: 'bus',
  },
  {
    basePrice: 1100,
    destination: 1,
    id: '0',
    isFavorite: false,
    offers: [1, 3],
    type: 'bus',
  },
];

const generateEvent = () => {
  const period = generatePeriod();
  const event = points[getRandomInteger(0, 2)];

  const dateFrom = period[0];
  const dateTo = period[1];

  return { ...event, dateFrom, dateTo };
};

export { generateEvent };

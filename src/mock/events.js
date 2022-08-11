const offers = [
  {
    'id': 1,
    'title': 'Upgrade to a business class',
    'price': 130,
  },
];

const destinations = [
  {
    'id': 1,
    'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    'name': 'Chamonix',
    'pictures': [
      {
        'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
        'description': 'Chamonix parliament building',
      },
    ],
  },
];

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
];

const generateEvent = () => points[0];

export { offers, destinations, generateEvent };

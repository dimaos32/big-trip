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
      {
        'src': 'http://picsum.photos/300/200?r=0.16076887885065805',
        'description': 'Chamonix parliament building',
      },
      {
        'src': 'http://picsum.photos/300/200?r=0.4129469854293657',
        'description': 'Chamonix parliament building',
      },
    ],
  },
];

const getDestinations = () => [...destinations];

export { getDestinations };

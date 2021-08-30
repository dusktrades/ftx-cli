import { composeSortOptionConfig } from '../../options/helpers/index.js';

const sortOption = composeSortOptionConfig([
  'currency',
  'c',

  'lendable',
  'le',

  'offered',
  'o',

  'locked',
  'lo',

  'min-rate',
  'r',
]);

const OFFERS = {
  NAME: 'offers',
  DESCRIPTION: 'Display my active lending offers.',
  OPTIONS: [{ OPTION: sortOption }],
};

export { OFFERS };

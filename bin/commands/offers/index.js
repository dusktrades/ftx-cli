import { composeSortOptionConfig } from '../../options/helpers/index.js';

const SORT_OPTION = composeSortOptionConfig([
  'currency',
  'lendable',
  'offered',
  'locked',
  'min-rate',
]);

const OFFERS = {
  NAME: 'offers',
  DESCRIPTION: 'display my open lending offers',
  OPTIONS: [{ OPTION: SORT_OPTION }],
};

export { OFFERS };

import { composeSortOption } from '../../options/helpers/index.js';
import { composeCommand } from '../composeCommand.js';

const SORT_OPTION = composeSortOption([
  'currency',
  'lendable',
  'offered',
  'locked',
  'min-rate',
]);

const CONFIG = {
  NAME: 'offers',
  DESCRIPTION: 'display my open lending offers',
  OPTIONS: [{ OPTION: SORT_OPTION }],
};

const OFFERS = composeCommand(CONFIG);

export { OFFERS };

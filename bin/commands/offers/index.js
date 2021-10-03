import { composeSortOption } from '../../options/helpers/index.js';
import { run } from './run.js';

const sortingMethods = [
  { parsed: 'currency', options: ['currency', 'c'] },
  { parsed: 'lendable', options: ['lendable', 'le'] },
  { parsed: 'offered', options: ['offered', 'o'] },
  { parsed: 'locked', options: ['locked', 'lo'] },
  { parsed: 'min-rate', options: ['min-rate', 'r'] },
];

const OFFERS = {
  name: 'offers',
  description: 'Display my active lending offers.',
  options: [{ option: composeSortOption(sortingMethods) }],
  run,
};

export { OFFERS };

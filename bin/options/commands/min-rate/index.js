import { parseNumber } from '../../helpers/parseNumber.js';

function parse(minRate) {
  return parseNumber(
    minRate,
    'Min rate must be a number greater than or equal to zero.',
    { allowNegative: false }
  );
}

const MIN_RATE = [
  '-r, --min-rate <rate>',
  'minimum yearly lending rate (%)',
  parse,
];

export { MIN_RATE };

import { parseNumber } from '../../helpers/index.js';

function parse(minRate) {
  return parseNumber(
    minRate,
    'Min rate must be a number greater than or equal to zero.',
    { allowNegative: false }
  );
}

const MIN_RATE = {
  FLAGS: '-r, --min-rate <rate>',
  DESCRIPTION: 'minimum yearly lending rate (%)',
  PARSER: parse,
};

export { MIN_RATE };

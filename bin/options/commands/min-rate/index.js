import { composeOption, parseNumber } from '../../helpers/index.js';

function parse(minRate) {
  return parseNumber(
    minRate,
    'Min rate must be a number greater than or equal to zero.',
    { allowNegative: false }
  );
}

const CONFIG = {
  FLAGS: '-r, --min-rate <rate>',
  DESCRIPTION: 'minimum yearly lending rate (%)',
  PARSER: parse,
};

const MIN_RATE = composeOption(CONFIG);

export { MIN_RATE };

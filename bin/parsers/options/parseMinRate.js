import { parseNumber } from '../helpers/parseNumber.js';

function parseMinRate(minRate) {
  return parseNumber(
    minRate,
    'Min rate must be a number greater than or equal to zero.',
    { allowNegative: false }
  );
}

export { parseMinRate };

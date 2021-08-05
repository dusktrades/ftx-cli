import { parseNumber } from '../helpers/parseNumber.js';

function parseTrailValue(trailValue) {
  return parseNumber(trailValue, 'Trail value must be a non-zero number.', {
    allowZero: false,
  });
}

export { parseTrailValue };

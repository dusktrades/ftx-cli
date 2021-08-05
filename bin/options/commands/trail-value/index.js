import { parseNumber } from '../../helpers/parseNumber.js';

function parse(trailValue) {
  return parseNumber(trailValue, 'Trail value must be a non-zero number.', {
    allowZero: false,
  });
}

const TRAIL_VALUE = ['--trail-value <value>', 'trail value', parse];

export { TRAIL_VALUE };

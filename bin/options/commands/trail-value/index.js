import { parseNumber } from '../../helpers/index.js';

function parse(trailValue) {
  return parseNumber(trailValue, 'Trail value must be a non-zero number.', {
    allowZero: false,
  });
}

const TRAIL_VALUE = {
  name: 'trailValue',
  flags: '--trail-value <value>',
  description:
    'Distance the price must change direction and move in order to trigger trailing stop orders.',
  parser: parse,
};

export { TRAIL_VALUE };

import { parseNumber } from '../../helpers/index.js';

function parse(trailValue) {
  return parseNumber(trailValue, 'Trail value must be a non-zero number.', {
    allowZero: false,
  });
}

const TRAIL_VALUE = {
  FLAGS: '--trail-value <value>',
  DESCRIPTION: 'trail value',
  PARSER: parse,
};

export { TRAIL_VALUE };

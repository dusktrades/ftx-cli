import { composeOption, parseNumber } from '../../helpers/index.js';

function parse(trailValue) {
  return parseNumber(trailValue, 'Trail value must be a non-zero number.', {
    allowZero: false,
  });
}

const CONFIG = {
  FLAGS: '--trail-value <value>',
  DESCRIPTION: 'trail value',
  PARSER: parse,
};

const TRAIL_VALUE = composeOption(CONFIG);

export { TRAIL_VALUE };

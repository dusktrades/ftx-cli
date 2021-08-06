import { composeOption, parseChoice } from '../../helpers/index.js';

const SIDES = [
  { parsed: 'buy', options: ['b', 'buy'] },
  { parsed: 'sell', options: ['s', 'sell'] },
];

const ALLOWED_OPTIONS = SIDES.flatMap((entry) => entry.options);

function parse(side) {
  return parseChoice(
    side,
    SIDES,
    `Side must be one of: ${ALLOWED_OPTIONS.join(', ')}.`
  );
}

const CONFIG = {
  FLAGS: '--side <side>',
  DESCRIPTION: 'order side',
  PARSER: parse,
};

const SIDE = composeOption(CONFIG);

export { SIDE };

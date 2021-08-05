import { parseChoice } from '../../helpers/parseChoice.js';

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

const SIDE = ['--side <side>', 'order side', parse];

export { SIDE };

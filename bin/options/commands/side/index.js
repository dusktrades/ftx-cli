import { parseChoice } from '../../helpers/index.js';

const sides = [
  { parsed: 'buy', options: ['buy', 'b'] },
  { parsed: 'sell', options: ['sell', 's'] },
];

const CHOICES = sides.flatMap(({ options }) => options);

function parse(side) {
  return parseChoice(
    side,
    sides,
    `Side must be one of: ${CHOICES.join(', ')}.`
  );
}

const SIDE = {
  FLAGS: '--side <side>',
  DESCRIPTION: 'Order side.',
  PARSER: parse,
};

export { SIDE, CHOICES };

import { composeInteractiveChoices, parseChoice } from '../../helpers/index.js';

const sides = [
  { parsed: 'buy', options: ['buy', 'b'], human: 'Buy' },
  { parsed: 'sell', options: ['sell', 's'], human: 'Sell' },
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
  name: 'side',
  flags: '--side <side>',
  description: 'Order side.',
  parser: parse,
  interactiveChoices: composeInteractiveChoices(sides),
};

export { SIDE, CHOICES };

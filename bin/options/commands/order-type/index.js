import { composeInteractiveChoices, parseChoice } from '../../helpers/index.js';

const types = [
  { parsed: 'market', options: ['market', 'm'], human: 'Market' },
  { parsed: 'limit', options: ['limit', 'l'], human: 'Limit' },
  {
    parsed: 'stop-market',
    options: ['stop-market', 'sm'],
    human: 'Stop market',
  },
  { parsed: 'stop-limit', options: ['stop-limit', 'sl'], human: 'Stop limit' },
  {
    parsed: 'trailing-stop',
    options: ['trailing-stop', 'ts'],
    human: 'Trailing stop',
  },
  {
    parsed: 'take-profit-market',
    options: ['take-profit-market', 'tpm'],
    human: 'Take profit market',
  },
  {
    parsed: 'take-profit-limit',
    options: ['take-profit-limit', 'tpl'],
    human: 'Take profit limit',
  },
];

const CHOICES = types.flatMap((entry) => entry.options);

function parse(type) {
  return parseChoice(
    type,
    types,
    `Order type must be one of: ${CHOICES.join(', ')}.`
  );
}

const ORDER_TYPE = {
  name: 'type',
  flags: '-t, --type <type>',
  description: 'Order type.',
  parser: parse,
  interactiveChoices: composeInteractiveChoices(types),
};

export { ORDER_TYPE, CHOICES };

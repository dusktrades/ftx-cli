import { parseChoice } from '../../helpers/index.js';

const types = [
  { parsed: 'market', options: ['market', 'm'] },
  { parsed: 'limit', options: ['limit', 'l'] },
  { parsed: 'stop-market', options: ['stop-market', 'sm'] },
  { parsed: 'stop-limit', options: ['stop-limit', 'sl'] },
  { parsed: 'trailing-stop', options: ['trailing-stop', 'ts'] },
  { parsed: 'take-profit-market', options: ['take-profit-market', 'tpm'] },
  { parsed: 'take-profit-limit', options: ['take-profit-limit', 'tpl'] },
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
  FLAGS: '-t, --type <type>',
  DESCRIPTION: 'Order type.',
  PARSER: parse,
};

export { ORDER_TYPE, CHOICES };

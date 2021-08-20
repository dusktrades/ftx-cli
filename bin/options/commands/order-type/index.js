import { parseChoice } from '../../helpers/index.js';

const ORDER_TYPES = [
  { parsed: 'market', options: ['m', 'market'] },
  { parsed: 'limit', options: ['l', 'limit'] },
  { parsed: 'stop-market', options: ['sm', 'stop-market'] },
  { parsed: 'stop-limit', options: ['sl', 'stop-limit'] },
  { parsed: 'trailing-stop', options: ['ts', 'trailing-stop'] },
  { parsed: 'take-profit-market', options: ['tpm', 'take-profit-market'] },
  { parsed: 'take-profit-limit', options: ['tpl', 'take-profit-limit'] },
];

const ALLOWED_OPTIONS = ORDER_TYPES.flatMap((entry) => entry.options);

function parse(orderType) {
  return parseChoice(
    orderType,
    ORDER_TYPES,
    `Order type must be one of: ${ALLOWED_OPTIONS.join(', ')}.`
  );
}

const ORDER_TYPE = {
  FLAGS: '-t, --type <type>',
  DESCRIPTION: 'Order type.',
  PARSER: parse,
};

export { ORDER_TYPE };

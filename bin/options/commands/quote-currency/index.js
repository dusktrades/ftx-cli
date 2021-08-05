import { parseCurrency } from '../../helpers/index.js';

const QUOTE_CURRENCY = [
  '-q, --quote-currency <currency>',
  'quote currency symbol(s)',
  parseCurrency,
];

export { QUOTE_CURRENCY };

import { parseCurrency } from '../../helpers/index.js';

const QUOTE_CURRENCY = {
  FLAGS: '-q, --quote-currency <currency>',
  DESCRIPTION: 'quote currency symbol(s)',
  PARSER: parseCurrency,
};

export { QUOTE_CURRENCY };

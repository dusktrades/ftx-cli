import { composeOption, parseCurrency } from '../../helpers/index.js';

const CONFIG = {
  FLAGS: '-q, --quote-currency <currency>',
  DESCRIPTION: 'quote currency symbol(s)',
  PARSER: parseCurrency,
};

const QUOTE_CURRENCY = composeOption(CONFIG);

export { QUOTE_CURRENCY };

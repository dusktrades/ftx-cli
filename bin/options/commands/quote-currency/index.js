import { parseUppercaseList } from '../../helpers/index.js';

const QUOTE_CURRENCY = {
  name: 'quoteCurrency',
  flags: '-q, --quote-currency <currency>',
  description: 'Quote currency symbol(s).',
  parser: parseUppercaseList,
};

export { QUOTE_CURRENCY };

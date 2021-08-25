import { parseUppercaseList } from '../../helpers/index.js';

const QUOTE_CURRENCY = {
  FLAGS: '-q, --quote-currency <currency>',
  DESCRIPTION: 'Quote currency symbol(s).',
  PARSER: parseUppercaseList,
};

export { QUOTE_CURRENCY };

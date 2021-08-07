import { parseCurrency } from '../../helpers/index.js';

const CURRENCY = {
  FLAGS: '-c, --currency <currency>',
  DESCRIPTION: 'currency symbol(s)',
  PARSER: parseCurrency,
};

export { CURRENCY };

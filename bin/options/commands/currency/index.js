import { parseCurrency } from '../../helpers/index.js';

const CURRENCY = [
  '-c, --currency <currency>',
  'currency symbol(s)',
  parseCurrency,
];

export { CURRENCY };

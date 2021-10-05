import { parseUppercaseList } from '../../helpers/index.js';

const CURRENCY = {
  name: 'currency',
  flags: '-c, --currency <currency>',
  description: 'Currency symbol(s).',
  parser: parseUppercaseList,
};

export { CURRENCY };

import { parseUppercaseList } from '../../helpers/index.js';

const CURRENCY = {
  FLAGS: '-c, --currency <currency>',
  DESCRIPTION: 'currency symbol(s)',
  PARSER: parseUppercaseList,
};

export { CURRENCY };

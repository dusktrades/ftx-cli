import { composeOption, parseCurrency } from '../../helpers/index.js';

const CONFIG = {
  FLAGS: '-c, --currency <currency>',
  DESCRIPTION: 'currency symbol(s)',
  PARSER: parseCurrency,
};

const CURRENCY = composeOption(CONFIG);

export { CURRENCY };

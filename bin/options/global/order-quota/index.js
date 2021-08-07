import { parseNumber } from '../../helpers/index.js';

function parse(orderQuota) {
  return parseNumber(
    orderQuota,
    'Order quota must be an integer greater than zero.',
    {
      allowNegative: false,
      allowZero: false,
      allowFloat: false,
    }
  ).toNumber();
}

const ORDER_QUOTA = {
  FLAGS: '--order-quota <quota>',
  DESCRIPTION: 'maximum number of orders placed per interval',
  PARSER: parse,
};

export { ORDER_QUOTA };

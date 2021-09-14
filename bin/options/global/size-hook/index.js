import { parseNumber } from '../../helpers/index.js';

const dynamicHooks = [
  /**
   * - Spot: available wallet balance (<= total wallet balance)
   *   - Buy: X quote currency (converted to base currency at execution price)
   *   - Sell: X base currency
   * - Futures: collateral amount not used by open orders/positions (converted
   *   to underlying currency at market price)
   */
  { name: 'default', choices: ['default', 'd'] },

  /**
   * - Spot: N/A
   * - Futures: absolute net position size in given market
   */
  { name: 'position', choices: ['position', 'p'] },
];

const DYNAMIC_HOOK_CHOICES = dynamicHooks.flatMap(({ choices }) => choices);

function parseStatic(size) {
  return parseNumber(
    size,
    `Size hook must be a number greater than zero or one of: ${DYNAMIC_HOOK_CHOICES.join(
      ', '
    )}`,
    { allowNegative: false, allowZero: false }
  );
}

function parse(sizeHook) {
  for (const { name, choices } of dynamicHooks) {
    if (choices.includes(sizeHook)) {
      return { type: 'dynamic', value: name };
    }
  }

  return { type: 'static', value: parseStatic(sizeHook) };
}

const SIZE_HOOK = {
  name: 'sizeHook',
  FLAGS: '--size-hook <hook>',
  DESCRIPTION:
    'Source size for calculating size if size is relative [default: default]',
  PARSER: parse,
  isConfigurable: true,
};

export { SIZE_HOOK, DYNAMIC_HOOK_CHOICES };

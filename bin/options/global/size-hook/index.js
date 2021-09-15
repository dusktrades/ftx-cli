import { parseChoice } from '../../helpers/index.js';

const sizeHooks = [
  /**
   * - Spot: available wallet balance (<= total wallet balance)
   *   - Buy: X quote currency (converted to base currency at execution price)
   *   - Sell: X base currency
   * - Futures: collateral amount not used by open orders/positions (converted
   *   to underlying currency at market price)
   */
  { parsed: 'default', options: ['default', 'd'] },

  /**
   * - Spot: N/A
   * - Futures: absolute net position size in given market
   */
  { parsed: 'position', options: ['position', 'p'] },
];

const CHOICES = sizeHooks.flatMap(({ options }) => options);

function parse(sizeHook) {
  return parseChoice(
    sizeHook,
    sizeHooks,
    `Size hook must be one of: ${CHOICES.join(', ')}.`
  );
}

const SIZE_HOOK = {
  name: 'sizeHook',
  FLAGS: '--size-hook <hook>',
  DESCRIPTION: 'Source size for calculating relative size [default: default]',
  PARSER: parse,
  isConfigurable: true,
};

export { SIZE_HOOK, CHOICES };

import { parseNumber } from '../../helpers/index.js';

const dynamicHooks = [
  { name: 'market', choices: ['market', 'm'] },
  { name: 'last', choices: ['last', 'l'] },
  { name: 'bid', choices: ['bid', 'b'] },
  { name: 'ask', choices: ['ask', 'a'] },
];

const DYNAMIC_HOOK_CHOICES = dynamicHooks.flatMap(({ choices }) => choices);

function parseStatic(price) {
  return parseNumber(
    price,
    'Price hook must be a number greater than zero or one of: market, m, last, l, bid, b, ask, a.',
    { allowNegative: false, allowZero: false }
  );
}

function parse(priceHook) {
  for (const { name, choices } of dynamicHooks) {
    if (choices.includes(priceHook)) {
      return { type: 'dynamic', value: name };
    }
  }

  return { type: 'static', value: parseStatic(priceHook) };
}

const PRICE_HOOK = {
  name: 'priceHook',
  FLAGS: '--price-hook <hook>',
  DESCRIPTION:
    'Source price for calculating price if price is relative [default: market].',
  PARSER: parse,
  isConfigurable: true,
};

export { PRICE_HOOK, DYNAMIC_HOOK_CHOICES };

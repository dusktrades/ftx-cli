import { parseNumber } from '../../helpers/index.js';

const namedHooks = [
  { name: 'mark', choices: new Set(['mark', 'm']) },
  { name: 'last', choices: new Set(['last', 'l']) },
  { name: 'bid', choices: new Set(['bid', 'b']) },
  { name: 'ask', choices: new Set(['ask', 'a']) },
];

function parsePrice(price) {
  return parseNumber(
    price,
    'Price hook must be a number greater than or equal to zero or one of: mark, m, last, l, bid, b, ask, a.',
    { allowNegative: false }
  );
}

function parse(priceHook) {
  for (const { name, choices } of namedHooks) {
    if (choices.has(priceHook)) {
      return { type: 'named', value: name };
    }
  }

  return { type: 'price', value: parsePrice(priceHook) };
}

const PRICE_HOOK = {
  name: 'priceHook',
  FLAGS: '--price-hook <hook>',
  DESCRIPTION:
    'Source price for calculating price if price is relative [default: mark]',
  PARSER: parse,
  isConfigurable: true,
};

export { PRICE_HOOK };

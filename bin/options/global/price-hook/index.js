import { parseChoice } from '../../helpers/index.js';

const priceHooks = [
  { parsed: 'market', options: ['market', 'm'] },
  { parsed: 'last', options: ['last', 'l'] },
  { parsed: 'bid', options: ['bid', 'b'] },
  { parsed: 'ask', options: ['ask', 'a'] },
];

const CHOICES = priceHooks.flatMap(({ options }) => options);

function parse(priceHook) {
  return parseChoice(
    priceHook,
    priceHooks,
    `Price hook must be one of: ${CHOICES.join(', ')}.`
  );
}

const PRICE_HOOK = {
  name: 'priceHook',
  flags: '--price-hook <hook>',
  description: 'Source price for calculating relative price [default: market].',
  parser: parse,
  isConfigurable: true,
};

export { PRICE_HOOK, CHOICES };

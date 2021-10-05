import { parseChoice } from '../../helpers/index.js';

const sizeCurrencies = [
  { parsed: 'base', options: ['base', 'b'] },
  { parsed: 'quote', options: ['quote', 'q'] },
];

const CHOICES = sizeCurrencies.flatMap((entry) => entry.options);

function parse(sizeCurrency) {
  return parseChoice(
    sizeCurrency,
    sizeCurrencies,
    `Size currency must be one of: ${CHOICES.join(', ')}.`
  );
}

const SIZE_CURRENCY = {
  name: 'sizeCurrency',
  flags: '--size-currency <source>',
  description: 'Source currency for calculating size [default: base].',
  parser: parse,
  isConfigurable: true,
};

export { SIZE_CURRENCY, CHOICES };

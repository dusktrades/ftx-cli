import { InvalidOptionArgumentError } from 'commander';

function parse(sizeCurrency) {
  if (['base', 'b'].includes(sizeCurrency)) {
    return 'base';
  }

  if (['quote', 'q'].includes(sizeCurrency)) {
    return 'quote';
  }

  throw new InvalidOptionArgumentError(
    'Size currency must be one of: base, b, quote, q.'
  );
}

const SIZE_CURRENCY = {
  name: 'sizeCurrency',
  FLAGS: '--size-currency <source>',
  DESCRIPTION: 'Source currency for calculating size [default: base].',
  PARSER: parse,
  isConfigurable: true,
};

export { SIZE_CURRENCY };

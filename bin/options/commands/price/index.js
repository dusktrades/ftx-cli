import {
  parseNumber,
  parseNumberRange,
  parseRelativeNumber,
} from '../../helpers/index.js';

const numberOptions = {
  allowNegative: false,
  allowZero: false,
};

function isRelative(price) {
  return ['%', '+', '-'].some((character) => price.includes(character));
}

function getType(price) {
  if (isRelative(price)) {
    return 'relative';
  }

  return price.includes(':') ? 'scaled' : 'basic';
}

function parseRelative(
  price,
  errorMessage = 'Price must be a non-zero relative number or percentage.'
) {
  return {
    type: 'relative',
    value: parseRelativeNumber(price, errorMessage, 'additive'),
  };
}

function parseScaled(
  price,
  errorMessage = 'Price must be a range of numbers greater than zero.'
) {
  return {
    type: 'scaled',
    value: parseNumberRange(price, errorMessage, numberOptions),
  };
}

function parseBasic(
  price,
  errorMessage = 'Price must be a number greater than zero.'
) {
  return {
    type: 'basic',
    value: parseNumber(price, errorMessage, numberOptions),
  };
}

function parse(price) {
  const errorMessage =
    'Price must be one of: number greater than zero, range of numbers greater than zero, non-zero relative number, non-zero relative percentage.';

  const type = getType(price);

  switch (type) {
    case 'relative':
      return parseRelative(price, errorMessage);
    case 'scaled':
      return parseScaled(price, errorMessage);
    default:
      return parseBasic(price, errorMessage);
  }
}

const PRICE = {
  name: 'price',
  flags: '-p, --price <price>',
  description: 'Price that limit orders will be executed at.',
  parser: parse,
  parseBasic,
  parseScaled,
  parseRelative,
};

export { PRICE };

import {
  parseNumber,
  parseNumberRange,
  parseRelativeNumber,
} from '../../helpers/index.js';

const errorMessage =
  'Price must be one of: number greater than zero, range of numbers greater than zero, non-zero relative number, non-zero relative percentage.';

function getType(price) {
  if (['%', '+', '-'].some((character) => price.includes(character))) {
    return 'relative';
  }

  return price.includes(':') ? 'range' : 'number';
}

function getNumberParser(type) {
  return type === 'range' ? parseNumberRange : parseNumber;
}

function parseValue(type, price) {
  if (type === 'relative') {
    return parseRelativeNumber(price, errorMessage, 'additive');
  }

  const numberParser = getNumberParser(type);

  return numberParser(price, errorMessage, {
    allowNegative: false,
    allowZero: false,
  });
}

function parse(price) {
  const type = getType(price);

  return { type, value: parseValue(type, price) };
}

const PRICE = {
  FLAGS: '-p, --price <price>',
  DESCRIPTION: 'Price that limit orders will be executed at.',
  PARSER: parse,
};

export { PRICE };

import { parseNumber, parseNumberRange } from '../../helpers/index.js';

function getType(price) {
  return price.includes(':') ? 'range' : 'number';
}

function parseValue(type, price) {
  const parser = type === 'range' ? parseNumberRange : parseNumber;

  return parser(
    price,
    'Price must be a number, or range of numbers (format: X:Y), greater than zero.',
    {
      allowNegative: false,
      allowZero: false,
    }
  );
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

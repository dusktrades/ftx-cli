import { parseNumber, parseNumberRange } from '../helpers/index.js';

function parsePrice(price) {
  const parser = price.includes(':') ? parseNumberRange : parseNumber;

  return parser(
    price,
    'Price must be a number, or range of numbers, greater than 0.',
    {
      allowNegative: false,
      allowZero: false,
    }
  );
}

export { parsePrice };

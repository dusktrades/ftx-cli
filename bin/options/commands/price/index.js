import { parseNumber, parseNumberRange } from '../../helpers/index.js';

function parse(price) {
  const parser = price.includes(':') ? parseNumberRange : parseNumber;

  return parser(
    price,
    'Price must be a number, or range of numbers, greater than zero.',
    {
      allowNegative: false,
      allowZero: false,
    }
  );
}

const PRICE = ['-p, --price <price>', 'limit price or price range', parse];

export { PRICE };

import {
  composeOption,
  parseNumber,
  parseNumberRange,
} from '../../helpers/index.js';

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

const CONFIG = {
  FLAGS: '-p, --price <price>',
  DESCRIPTION: 'limit price or price range',
  PARSER: parse,
};

const PRICE = composeOption(CONFIG);

export { PRICE };

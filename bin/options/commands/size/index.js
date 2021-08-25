import { parseNumber } from '../../helpers/index.js';

function parse(size) {
  return parseNumber(size, 'Size must be a number greater than zero.', {
    allowNegative: false,
    allowZero: false,
  });
}

const SIZE = {
  FLAGS: '-s, --size <size>',
  DESCRIPTION: 'Size to execute (spot: base currency; futures: underlying).',
  PARSER: parse,
};

export { SIZE };

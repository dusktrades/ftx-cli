import { parseNumber } from '../../helpers/index.js';

function parse(size) {
  return parseNumber(size, 'Size must be a number greater than zero.', {
    allowNegative: false,
    allowZero: false,
  });
}

const SIZE = ['-s, --size <size>', 'currency amount', parse];

export { SIZE };

import { parseNumber } from '../helpers/index.js';

function parseSize(size) {
  return parseNumber(size, 'Size must be a number greater than 0.', {
    allowNegative: false,
    allowZero: false,
  });
}

export { parseSize };

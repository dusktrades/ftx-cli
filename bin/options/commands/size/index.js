import { composeOption, parseNumber } from '../../helpers/index.js';

function parse(size) {
  return parseNumber(size, 'Size must be a number greater than zero.', {
    allowNegative: false,
    allowZero: false,
  });
}

const CONFIG = {
  FLAGS: '-s, --size <size>',
  DESCRIPTION: 'currency amount',
  PARSER: parse,
};

const SIZE = composeOption(CONFIG);

export { SIZE };

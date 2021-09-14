import { parseNumber, parseRelativeNumber } from '../../helpers/index.js';

const errorMessage = 'Size must be a number or percentage greater than zero.';

function getType(size) {
  return size.includes('%') ? 'relative' : 'number';
}

function parseRelativeSize(size) {
  return {
    type: 'relative',
    value: parseRelativeNumber(size, errorMessage, 'multiplicative'),
  };
}

function parseNumberSize(size) {
  return {
    type: 'number',
    value: parseNumber(size, errorMessage, {
      allowNegative: false,
      allowZero: false,
    }),
  };
}

function parse(size) {
  const type = getType(size);

  return type === 'relative' ? parseRelativeSize(size) : parseNumberSize(size);
}

const SIZE = {
  FLAGS: '-s, --size <size>',
  DESCRIPTION: 'Size to execute.',
  PARSER: parse,
};

export { SIZE };

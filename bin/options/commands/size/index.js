import { parseNumber, parseRelativeNumber } from '../../helpers/index.js';

function getType(size) {
  return size.includes('%') ? 'relative' : 'basic';
}

function parseRelative(
  size,
  errorMessage = 'Size must be a percentage greater than zero.'
) {
  return {
    type: 'relative',
    value: parseRelativeNumber(size, errorMessage, 'multiplicative'),
  };
}

function parseBasic(
  size,
  errorMessage = 'Size must be a number greater than zero.'
) {
  return {
    type: 'basic',
    value: parseNumber(size, errorMessage, {
      allowNegative: false,
      allowZero: false,
    }),
  };
}

function parse(size) {
  const errorMessage = 'Size must be a number or percentage greater than zero.';
  const type = getType(size);

  return type === 'relative'
    ? parseRelative(size, errorMessage)
    : parseBasic(size, errorMessage);
}

const SIZE = {
  name: 'size',
  flags: '-s, --size <size>',
  description: 'Size to execute.',
  parser: parse,
  parseBasic,
  parseRelative,
};

export { SIZE };

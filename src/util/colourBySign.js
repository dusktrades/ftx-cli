import chalk from 'chalk';

function getColour(value) {
  if (value < 0) {
    return 'red';
  }

  if (value > 0) {
    return 'green';
  }

  return null;
}

function colourBySign(formattedValue, compareValue) {
  const colour = getColour(compareValue);

  return colour == null ? formattedValue : chalk[colour](formattedValue);
}

export { colourBySign };

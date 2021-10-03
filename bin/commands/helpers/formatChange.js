import chalk from 'chalk';

import {
  convertDecimalToPercentage,
  formatPercentageChange,
} from '../../../src/util/index.js';

function shouldColour(change) {
  return change != null && change !== 0;
}

function getColour(change) {
  return change < 0 ? 'red' : 'green';
}

function formatChangePercentage(change) {
  const changePercentage = convertDecimalToPercentage(change);
  const formattedChangePercentage = formatPercentageChange(changePercentage);

  return shouldColour(change)
    ? chalk[getColour(change)](formattedChangePercentage)
    : formattedChangePercentage;
}

function formatChange({ change1h, change24h }) {
  return [change1h, change24h]
    .map((change) => formatChangePercentage(change))
    .join(' / ');
}

export { formatChange };

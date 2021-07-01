import chalk from 'chalk';

import { formatPercentageChange } from '../util/index.js';

function getChangePercentageColour(changePercentage) {
  if (changePercentage > 0) {
    return 'green';
  }

  if (changePercentage < 0) {
    return 'red';
  }

  return 'white';
}

function formatChangePercentage(changePercentage, enableColours) {
  const formattedChangePercentage = formatPercentageChange(changePercentage);

  if (!enableColours) {
    return formattedChangePercentage;
  }

  const colour = getChangePercentageColour(changePercentage);

  return chalk[colour](formattedChangePercentage);
}

function formatChange(entry, enableColours) {
  return [entry.change1hPercentage, entry.change24hPercentage]
    .map((changePercentage) =>
      formatChangePercentage(changePercentage, enableColours)
    )
    .join(' / ');
}

export { formatChange };

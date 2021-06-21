import { formatPercentage } from './formatPercentage.js';
import { getValueSign } from './getValueSign.js';

function formatPercentageChange(percentageChange) {
  const formattedPercentage = formatPercentage(Math.abs(percentageChange));

  return `${getValueSign(percentageChange)}${formattedPercentage}`;
}

export { formatPercentageChange };

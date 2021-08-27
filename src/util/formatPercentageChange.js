import { formatPercentage } from './formatPercentage.js';
import { getValueSign } from './getValueSign.js';

function formatPercentageChange(percentageChange) {
  const formattedPercentage = formatPercentage(Math.abs(percentageChange), 4);

  return `${getValueSign(percentageChange)}${formattedPercentage}`;
}

export { formatPercentageChange };

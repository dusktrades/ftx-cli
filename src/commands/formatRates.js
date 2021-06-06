import chalk from 'chalk';

import {
  convertDecimalToPercentage,
  convertHourlyToYearly,
  formatPercentage,
} from '../util/index.js';

function getColour(yearlyPercentage) {
  if (yearlyPercentage < 5) {
    return 'red';
  }

  if (yearlyPercentage < 10) {
    return 'yellow';
  }

  return 'green';
}

function formatYearlyPercentage(yearlyPercentage) {
  const colour = getColour(yearlyPercentage);

  return chalk[colour](formatPercentage(yearlyPercentage));
}

function formatString(hourlyPercentage, yearlyPercentage) {
  const formattedHourlyPercentage = formatPercentage(hourlyPercentage);
  const formattedYearlyPercentage = formatYearlyPercentage(yearlyPercentage);

  return `${formattedHourlyPercentage} / ${formattedYearlyPercentage}`;
}

function formatRates(hourlyDecimal) {
  const hourlyPercentage = convertDecimalToPercentage(hourlyDecimal);
  const yearlyPercentage = convertHourlyToYearly(hourlyPercentage);

  return formatString(hourlyPercentage, yearlyPercentage);
}

export { formatRates };

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

function formatYearlyPercentage(yearlyPercentage, enableColours) {
  const formattedPercentage = formatPercentage(yearlyPercentage);

  if (!enableColours) {
    return formattedPercentage;
  }

  const colour = getColour(yearlyPercentage);

  return chalk[colour](formattedPercentage);
}

function formatString(hourlyPercentage, yearlyPercentage, enableColours) {
  const formattedHourlyPercentage = formatPercentage(hourlyPercentage);

  const formattedYearlyPercentage = formatYearlyPercentage(
    yearlyPercentage,
    enableColours
  );

  return `${formattedHourlyPercentage} / ${formattedYearlyPercentage}`;
}

function formatRates(hourlyDecimal, enableColours) {
  const hourlyPercentage = convertDecimalToPercentage(hourlyDecimal);
  const yearlyPercentage = convertHourlyToYearly(hourlyPercentage);

  return formatString(hourlyPercentage, yearlyPercentage, enableColours);
}

export { formatRates };

import chalk from 'chalk';

import {
  convertDecimalToPercentage,
  convertHourlyToYearly,
  formatPercentage,
} from '../../../src/util/index.js';

function getColourByFunding(yearlyPercentage) {
  if (yearlyPercentage < 0) {
    return 'red';
  }

  if (yearlyPercentage > 0) {
    return 'green';
  }

  return 'white';
}

function getColourByLending(yearlyPercentage) {
  if (yearlyPercentage < 5) {
    return 'red';
  }

  if (yearlyPercentage < 10) {
    return 'yellow';
  }

  return 'green';
}

const getColour = {
  funding: getColourByFunding,
  lending: getColourByLending,
};

function formatYearlyPercentage(yearlyPercentage, type) {
  const formattedPercentage = formatPercentage(yearlyPercentage, 4);
  const colour = getColour[type](yearlyPercentage);

  return chalk[colour](formattedPercentage);
}

function formatRates(hourlyDecimal, type) {
  const hourlyPercentage = convertDecimalToPercentage(hourlyDecimal);
  const yearlyPercentage = convertHourlyToYearly(hourlyPercentage);
  const formattedHourlyPercentage = formatPercentage(hourlyPercentage, 4);

  const formattedYearlyPercentage = formatYearlyPercentage(
    yearlyPercentage,
    type
  );

  return `${formattedHourlyPercentage} / ${formattedYearlyPercentage}`;
}

export { formatRates };

import { parseNumber } from '../../helpers/index.js';

// TODO: Move to util.
const hoursPerYear = 8760;

function calculateHourlyRateDecimal(yearlyMinRatePercentage) {
  const hourlyMinRatePercentage =
    yearlyMinRatePercentage.dividedBy(hoursPerYear);

  return hourlyMinRatePercentage.dividedBy(100);
}

function parse(minRate) {
  const yearlyMinRatePercentage = parseNumber(
    minRate,
    'Min. rate must be a number greater than or equal to zero.',
    { allowNegative: false }
  );

  const hourlyRateDecimal = calculateHourlyRateDecimal(yearlyMinRatePercentage);

  return hourlyRateDecimal.toNumber();
}

const MIN_RATE = {
  name: 'minRate',
  flags: '-r, --min-rate <rate>',
  description: 'Minimum yearly lending rate (%).',
  parser: parse,
};

export { MIN_RATE };

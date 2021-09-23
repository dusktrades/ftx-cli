import BigNumber from 'bignumber.js';

import { getValueSign } from './getValueSign.js';

function getSign(value, explicitSign) {
  if (explicitSign) {
    return getValueSign(value);
  }

  return value < 0 ? '-' : '';
}

function composePrefix(value, explicitSign) {
  const sign = getSign(value, explicitSign);

  return `${sign}$`;
}

function formatUsd(
  value,
  { explicitSign = false, strictDecimalPlaces = true } = {}
) {
  if (value == null) {
    return '-';
  }

  const decimalPlaces = strictDecimalPlaces ? 2 : null;
  const absoluteValue = BigNumber(value).abs();

  return new BigNumber(absoluteValue).toFormat(decimalPlaces, null, {
    prefix: composePrefix(value, explicitSign),
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0,
    suffix: '',
  });
}

export { formatUsd };

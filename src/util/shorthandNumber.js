const ONE_TRILLION = 1_000_000_000_000;
const ONE_BILLION = 1_000_000_000;
const ONE_MILLION = 1_000_000;
const ONE_THOUSAND = 1000;

function formatNumber(value, divisor, shorthandCharacter) {
  const multiplier = value / divisor;

  return `${multiplier.toFixed(2)}${shorthandCharacter}`;
}

function shorthandNumber(value) {
  if (value >= ONE_TRILLION) {
    return formatNumber(value, ONE_TRILLION, 'T');
  }

  if (value >= ONE_BILLION) {
    return formatNumber(value, ONE_BILLION, 'B');
  }

  if (value >= ONE_MILLION) {
    return formatNumber(value, ONE_MILLION, 'M');
  }

  if (value >= ONE_THOUSAND) {
    return formatNumber(value, ONE_THOUSAND, 'K');
  }

  return value.toFixed(2);
}

export { shorthandNumber };

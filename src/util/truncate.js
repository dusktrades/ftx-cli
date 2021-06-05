const MATCH_INTEGER = '-?\\d+';

function matchFloat(decimalPlaces) {
  return `${MATCH_INTEGER}(?:\\.\\d{1,${decimalPlaces}})?`;
}

function composeRegEx(decimalPlaces) {
  return new RegExp(
    decimalPlaces == null ? MATCH_INTEGER : matchFloat(decimalPlaces)
  );
}

function getStringMatch(value, decimalPlaces) {
  /**
   * Use toFixed over toString to avoid scientific notation, with an extra
   * decimal place to prevent rounding.
   */
  const stringValue = value.toFixed(decimalPlaces + 1);

  return stringValue.match(composeRegEx(decimalPlaces))[0];
}

function truncate(value, decimalPlaces) {
  return Number.parseFloat(getStringMatch(value, decimalPlaces));
}

export { truncate };

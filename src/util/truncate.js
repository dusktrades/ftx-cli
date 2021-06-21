const MATCH_INTEGER = '-?\\d+';

function matchFloat(decimalPlaces) {
  return `${MATCH_INTEGER}(?:\\.\\d{1,${decimalPlaces}})?`;
}

function composeRegEx(decimalPlaces) {
  return new RegExp(
    decimalPlaces == null ? MATCH_INTEGER : matchFloat(decimalPlaces)
  );
}

function truncate(value, decimalPlaces) {
  /**
   * Use toFixed over toString to avoid scientific notation, with extra decimal
   * places to prevent rounding.
   */
  const stringValue = value.toFixed(decimalPlaces + 2);
  const match = stringValue.match(composeRegEx(decimalPlaces));

  if (match == null) {
    return null;
  }

  return Number.parseFloat(match[0]);
}

export { truncate };

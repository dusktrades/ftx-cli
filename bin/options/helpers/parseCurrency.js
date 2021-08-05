function parseCurrency(currency) {
  return currency.split(',').map((entry) => entry.toUpperCase());
}

export { parseCurrency };

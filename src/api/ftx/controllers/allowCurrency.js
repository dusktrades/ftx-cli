function allowCurrency(allowedCurrencies, currency) {
  if (allowedCurrencies == null) {
    return true;
  }

  return allowedCurrencies.includes(currency);
}

export { allowCurrency };

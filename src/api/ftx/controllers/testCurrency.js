function testCurrency(filter, currency) {
  return filter == null ? true : filter.includes(currency);
}

export { testCurrency };

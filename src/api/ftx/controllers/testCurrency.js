function testCurrency(filter, currency) {
  return filter == null
    ? true
    : filter.some(
        (filterCurrency) => filterCurrency.toUpperCase() === currency
      );
}

export { testCurrency };

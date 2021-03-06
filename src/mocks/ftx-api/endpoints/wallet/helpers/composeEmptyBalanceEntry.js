function composeEmptyBalanceEntry(currency) {
  return {
    coin: currency,
    free: 123.456_789_123_456_789,
    spotBorrow: 1.234_567_891_234_567_89,
    total: 0,
    usdValue: 123_456_789.123_456_789,
    availableWithoutBorrow: 12.345_678_912_345_678_9,
  };
}

export { composeEmptyBalanceEntry };

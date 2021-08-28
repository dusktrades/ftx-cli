import { MOCK_HOSTNAME_NO_SUBACCOUNT } from '../mockHostnames.js';

function composeMockBalanceEntry(currency) {
  return {
    coin: currency,
    free: 123.456_789_123_456_789,
    spotBorrow: 1.234_567_891_234_567_89,
    total: 1234.567_891_234_567_89,
    usdValue: 123_456_789.123_456_789,
    availableWithoutBorrow: 12.345_678_912_345_678_9,
  };
}

const successResponse = {
  success: true,
  result: {
    main: ['USD', 'ETH', 'USDT', 'BTC', 'FTT'].map((currency) =>
      composeMockBalanceEntry(currency)
    ),
    'a-testing': ['USD', 'USDT'].map((currency) =>
      composeMockBalanceEntry(currency)
    ),
    'z-testing': ['USD', 'USDT'].map((currency) =>
      composeMockBalanceEntry(currency)
    ),
  },
};

function mockGetAllBalances() {
  MOCK_HOSTNAME_NO_SUBACCOUNT.get('/api/wallet/all_balances').reply(
    200,
    successResponse
  );
}

export { mockGetAllBalances };

import {
  MOCK_HOSTNAME_VALID_SUBACCOUNT,
  MOCK_HOSTNAME_INVALID_SUBACCOUNT,
} from '../mockHostnames.js';

const successResponse = {
  success: true,
  result: ['USD', 'ETH', 'USDT', 'BTC', 'FTT'].map((currency) => ({
    coin: currency,
    free: 123.456_789_123_456_789,
    spotBorrow: 1.234_567_891_234_567_89,
    total: 1234.567_891_234_567_89,
    usdValue: 123_456_789.123_456_789,
    availableWithoutBorrow: 12.345_678_912_345_678_9,
  })),
};

function mockGetBalances() {
  MOCK_HOSTNAME_VALID_SUBACCOUNT.get('/api/wallet/balances').reply(
    200,
    successResponse
  );

  MOCK_HOSTNAME_INVALID_SUBACCOUNT.get('/api/wallet/balances').reply(500, {
    success: false,
    error: 'No such subaccount',
  });
}

export { mockGetBalances };

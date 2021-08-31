import { MOCK_INVALID_MARKET } from './mockInvalidMarket.js';

const MARKET_NOT_FOUND_ERROR = {
  request: (requestBody) => requestBody.market === MOCK_INVALID_MARKET,
  response: {
    success: false,
    error: 'No such market: INVALID-MARKET',
  },
};

export { MARKET_NOT_FOUND_ERROR };

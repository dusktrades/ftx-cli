import { MOCK_INVALID_MARKET } from './mockInvalidMarket.js';

const MARKET_NOT_FOUND_ERROR = {
  REQUEST: (requestBody) => requestBody.market === MOCK_INVALID_MARKET,
  RESPONSE: {
    success: false,
    error: 'No such market: INVALID-MARKET',
  },
};

export { MARKET_NOT_FOUND_ERROR };

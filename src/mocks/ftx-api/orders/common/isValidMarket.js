import { MOCK_INVALID_MARKET } from './mockInvalidMarket.js';

function isValidMarket(market) {
  return market !== MOCK_INVALID_MARKET;
}

export { isValidMarket };

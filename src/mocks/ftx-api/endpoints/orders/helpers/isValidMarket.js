import { MOCK_INVALID_MARKET } from '../../../helpers/index.js';

function isValidMarket(market) {
  return market !== MOCK_INVALID_MARKET;
}

export { isValidMarket };

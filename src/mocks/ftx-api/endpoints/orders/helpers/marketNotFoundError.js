import { MOCK_INVALID_MARKET } from '../../../helpers/index.js';

const MARKET_NOT_FOUND_ERROR = {
  request: (requestBody) => requestBody.market === MOCK_INVALID_MARKET,
  response: {
    success: false,
    error: `No such market: ${MOCK_INVALID_MARKET} `,
  },
};

export { MARKET_NOT_FOUND_ERROR };

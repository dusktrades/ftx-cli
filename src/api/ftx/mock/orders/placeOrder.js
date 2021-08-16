import { MOCK_HOSTNAME } from '../mockHostname.js';

const MOCK_INVALID_MARKET = 'INVALID-MARKET';

const MARKET_NOT_FOUND_ERROR = {
  REQUEST: (requestBody) => requestBody.market === MOCK_INVALID_MARKET,
  RESPONSE: {
    success: false,
    error: 'No such market: INVALID-MARKET',
  },
};

function isSuccessfulRequest(requestBody) {
  if (requestBody.market === MOCK_INVALID_MARKET) {
    return false;
  }

  if (!['buy', 'sell'].includes(requestBody.side)) {
    return false;
  }

  if (!['market', 'limit'].includes(requestBody.type)) {
    return false;
  }

  if (requestBody.size <= 0) {
    return false;
  }

  if (requestBody.type === 'limit' && requestBody.price <= 0) {
    return false;
  }

  if (requestBody.externalReferralProgram !== 'FTX CLI') {
    return false;
  }

  return true;
}

function placeOrder() {
  const ENDPOINT = '/api/orders';

  MOCK_HOSTNAME.post(ENDPOINT, MARKET_NOT_FOUND_ERROR.REQUEST)
    .reply(500, MARKET_NOT_FOUND_ERROR.RESPONSE)
    .post(ENDPOINT, isSuccessfulRequest)
    .reply(200, { success: true, result: {} });
}

export { placeOrder };

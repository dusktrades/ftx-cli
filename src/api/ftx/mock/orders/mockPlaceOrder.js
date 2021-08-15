import { MOCK_HOSTNAME } from '../mockHostname.js';

const SUCCESS_RESPONSE = {
  success: true,
  result: {
    createdAt: '2021-01-01T00:00:00.000000+00:00',
    filledSize: 0,
    future: 'BTC-PERP',
    id: 1,
    market: 'BTC-PERP',
    price: 10,
    remainingSize: 1,
    side: 'buy',
    size: 1,
    status: 'open',
    type: 'limit',
    reduceOnly: false,
    ioc: false,
    postOnly: false,
    clientId: null,
  },
};

const ERROR_INVALID_MARKET_RESPONSE = {
  success: false,
  error: 'No such market: INVALID-MARKET',
};

function mockPlaceOrder() {
  MOCK_HOSTNAME.post(
    '/api/orders',
    (requestBody) => requestBody.market === 'INVALID-MARKET'
  )
    .reply(500, ERROR_INVALID_MARKET_RESPONSE)
    .post('/api/orders')
    .reply(200, SUCCESS_RESPONSE);
}

export { mockPlaceOrder };

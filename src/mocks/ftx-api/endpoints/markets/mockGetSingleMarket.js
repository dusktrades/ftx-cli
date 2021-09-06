import { interceptTestCase } from '../../helpers/index.js';

const testCases = [
  // Valid market.
  {
    endpoint: 'markets/BTC/USD',
    statusCode: 200,
    response: {
      success: true,
      result: {
        ask: 10_001,
        baseCurrency: 'BTC',
        bid: 10_000,
        change1h: -0.01,
        change24h: 0.01,
        changeBod: 0.01,
        enabled: true,
        highLeverageFeeExempt: true,
        last: 10_000,
        minProvideSize: 0.0001,
        name: 'BTC/USD',
        postOnly: false,
        price: 10_000,
        priceIncrement: 1,
        quoteCurrency: 'USD',
        quoteVolume24h: 500_000_000,
        restricted: false,
        sizeIncrement: 0.0001,
        type: 'spot',
        underlying: null,
        volumeUsd24h: 500_000_000,
      },
    },
  },
];

function mockGetSingleMarket() {
  for (const testCase of testCases) {
    interceptTestCase({
      ...testCase,
      method: 'get',
    });
  }
}

export { mockGetSingleMarket };

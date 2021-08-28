import nock from 'nock';

import { COMMON_REQUEST_HEADERS, HOSTNAME } from '../../helpers/index.js';
import { composeBalanceEntry } from './helpers/index.js';

const validSubaccountResponse = {
  success: true,
  result: ['USD', 'ETH', 'USDT', 'BTC', 'FTT'].map((currency) =>
    composeBalanceEntry(currency)
  ),
};

const invalidSubaccountResponse = {
  success: false,
  error: 'No such subaccount',
};

function mockGetBalances() {
  nock(HOSTNAME, {
    reqheaders: {
      ...COMMON_REQUEST_HEADERS,
      'ftx-key': 'key',
      'ftx-subaccount': 'subaccount',
    },
  })
    .persist()
    .get('/api/wallet/balances')
    .reply(200, validSubaccountResponse);

  nock(HOSTNAME, {
    reqheaders: {
      ...COMMON_REQUEST_HEADERS,
      'ftx-key': 'key',
      'ftx-subaccount': 'invalid-subaccount',
    },
  })
    .get('/api/wallet/balances')
    .reply(500, invalidSubaccountResponse);
}

export { mockGetBalances };

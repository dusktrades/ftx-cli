import nock from 'nock';

import { COMMON_REQUEST_HEADERS, HOSTNAME } from '../../helpers/index.js';
import { composeBalanceEntry } from './helpers/index.js';

const main = ['USD', 'ETH', 'USDT', 'BTC', 'FTT'].map((currency) =>
  composeBalanceEntry(currency)
);

const accountWithSubaccountsResponse = {
  success: true,
  result: {
    main,
    'a-subaccount': ['USD', 'USDT'].map((currency) =>
      composeBalanceEntry(currency)
    ),
    'z-subaccount': ['USD', 'USDT'].map((currency) =>
      composeBalanceEntry(currency)
    ),
  },
};

const accountWithoutSubaccountsResponse = {
  success: true,
  result: { main },
};

function mockGetAllBalances() {
  nock(HOSTNAME, {
    reqheaders: {
      ...COMMON_REQUEST_HEADERS,
      'ftx-key': 'account-with-subaccounts',
    },
  })
    .persist()
    .get('/api/wallet/all_balances')
    .reply(200, accountWithSubaccountsResponse);

  nock(HOSTNAME, {
    reqheaders: {
      ...COMMON_REQUEST_HEADERS,
      'ftx-key': 'account-without-subaccounts',
    },
  })
    .persist()
    .get('/api/wallet/all_balances')
    .reply(200, accountWithoutSubaccountsResponse);
}

export { mockGetAllBalances };

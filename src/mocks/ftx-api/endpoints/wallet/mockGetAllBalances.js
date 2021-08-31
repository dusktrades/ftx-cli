import { interceptTestCase } from '../../helpers/index.js';

import {
  composeBalanceEntry,
  composeEmptyBalanceEntry,
} from './helpers/index.js';

const testCases = [
  // Account with subaccounts.
  {
    additionalRequestHeaders: { 'ftx-key': 'account-with-subaccounts' },
    statusCode: 200,
    response: {
      success: true,
      result: {
        main: [
          ...['USD', 'ETH', 'USDT', 'BTC', 'FTT'].map((currency) =>
            composeBalanceEntry(currency)
          ),
          composeEmptyBalanceEntry('DOGE'),
        ],
        'z-subaccount': ['USD', 'USDT'].map((currency) =>
          composeBalanceEntry(currency)
        ),
        'a-subaccount': [composeBalanceEntry('USD')],
        'empty-subaccount-1': [composeEmptyBalanceEntry('BTC')],
        'empty-subaccount-2': ['BTC', 'ETH'].map((currency) =>
          composeEmptyBalanceEntry(currency)
        ),
      },
    },
  },

  // Account without subaccounts.
  {
    additionalRequestHeaders: { 'ftx-key': 'account-without-subaccounts' },
    statusCode: 200,
    response: {
      success: true,
      result: {
        main: [
          ...['USD', 'ETH', 'USDT', 'BTC', 'FTT'].map((currency) =>
            composeBalanceEntry(currency)
          ),
          composeEmptyBalanceEntry('DOGE'),
        ],
      },
    },
  },
];

function mockGetAllBalances() {
  for (const testCase of testCases) {
    interceptTestCase({
      ...testCase,
      endpoint: 'wallet/all_balances',
      method: 'get',
    });
  }
}

export { mockGetAllBalances };

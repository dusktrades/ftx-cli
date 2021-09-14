import { interceptTestCase } from '../../helpers/index.js';

import {
  composeBalanceEntry,
  composeEmptyBalanceEntry,
} from './helpers/index.js';

const testCases = [
  // Subaccount with balances.
  {
    additionalRequestHeaders: {
      'ftx-key': 'key',
      'ftx-subaccount': 'subaccount-with-balances',
    },
    statusCode: 200,
    response: {
      success: true,
      result: [
        ...['USD', 'ETH', 'USDT', 'BTC', 'FTT'].map((currency) =>
          composeBalanceEntry(currency)
        ),
        composeEmptyBalanceEntry('DOGE'),
      ],
    },
  },

  // Subaccount without balances.
  {
    additionalRequestHeaders: {
      'ftx-key': 'key',
      'ftx-subaccount': 'subaccount-without-balances',
    },
    statusCode: 200,
    response: {
      success: true,
      result: ['BTC', 'ETH'].map((currency) =>
        composeEmptyBalanceEntry(currency)
      ),
    },
  },

  // Invalid subaccount.
  {
    additionalRequestHeaders: {
      'ftx-key': 'key',
      'ftx-subaccount': 'invalid',
    },
    statusCode: 500,
    response: {
      success: false,
      error: 'No such subaccount',
    },
  },

  // Catch-all success.
  {
    additionalRequestHeaders: { 'ftx-key': 'key' },
    statusCode: 200,
    response: {
      success: true,
      result: ['BTC', 'USD'].map((currency) => composeBalanceEntry(currency)),
    },
  },
];

function mockGetBalances() {
  for (const testCase of testCases) {
    interceptTestCase({
      ...testCase,
      endpoint: 'wallet/balances',
      method: 'get',
      requiresAuthentication: true,
    });
  }
}

export { mockGetBalances };

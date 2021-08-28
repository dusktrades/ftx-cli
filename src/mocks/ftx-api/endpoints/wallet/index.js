import { mockGetAllBalances } from './mockGetAllBalances.js';
import { mockGetBalances } from './mockGetBalances.js';

function mockWallet() {
  mockGetBalances();
  mockGetAllBalances();
}

export { mockWallet };

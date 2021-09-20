import { mockAccount } from './endpoints/account/index.js';
import { mockMarkets } from './endpoints/markets/index.js';
import { mockOrders } from './endpoints/orders/index.js';
import { mockTime } from './endpoints/time/index.js';
import { mockWallet } from './endpoints/wallet/index.js';

function create() {
  mockAccount();
  mockMarkets();
  mockOrders();
  mockTime();
  mockWallet();
}

const MockFtxApi = { create };

export { MockFtxApi };

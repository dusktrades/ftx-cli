import { mockOrders } from './endpoints/orders/index.js';
import { mockTime } from './endpoints/time/index.js';
import { mockWallet } from './endpoints/wallet/index.js';

function create() {
  mockOrders();
  mockTime();
  mockWallet();
}

const MockFtxApi = { create };

export { MockFtxApi };

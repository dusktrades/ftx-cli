import { mockOrders } from './endpoints/orders/index.js';
import { mockWallet } from './endpoints/wallet/index.js';

function create() {
  mockOrders();
  mockWallet();
}

const MockFtxApi = { create };

export { MockFtxApi };

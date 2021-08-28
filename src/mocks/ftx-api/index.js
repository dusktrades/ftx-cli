import { mockOrders } from './orders/index.js';
import { mockWallet } from './wallet/index.js';

function create() {
  mockOrders();
  mockWallet();
}

const MockFtxApi = { create };

export { MockFtxApi };

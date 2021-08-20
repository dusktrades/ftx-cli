import { mockOrders } from './orders/index.js';

function create() {
  mockOrders();
}

const MockFtxApi = { create };

export { MockFtxApi };

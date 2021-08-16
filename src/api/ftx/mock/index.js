import { orders } from './orders/index.js';

function mockFtxApi() {
  orders.placeOrder();
}

export { mockFtxApi };

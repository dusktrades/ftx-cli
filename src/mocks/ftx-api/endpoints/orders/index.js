import { mockPlaceOrder } from './mockPlaceOrder.js';
import { mockPlaceTriggerOrder } from './mockPlaceTriggerOrder.js';

function mockOrders() {
  mockPlaceOrder();
  mockPlaceTriggerOrder();
}

export { mockOrders };

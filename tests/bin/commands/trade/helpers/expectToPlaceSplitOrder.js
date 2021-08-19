import { expectToPlaceOrders } from './expectToPlaceOrders.js';

async function expectToPlaceSplitOrder(baseOptions) {
  const options = `${baseOptions} --split 2`;

  await expectToPlaceOrders(options, 2);
}

export { expectToPlaceSplitOrder };

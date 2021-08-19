import { expectToPlaceOrders } from './expectToPlaceOrders.js';

async function expectToPlaceScaledOrder(baseOptions) {
  const options = `${baseOptions} --price 10:20 --split 2`;

  await expectToPlaceOrders(options, 2);
}

export { expectToPlaceScaledOrder };

import { expectToPlaceOrders } from './expectToPlaceOrders.js';

const SHORTHANDS = ['k', 'm'];

async function expectToAcceptShorthandNumberArguments(composeOptions) {
  const expectations = SHORTHANDS.map((shorthand) => {
    const options = composeOptions(shorthand);

    return expectToPlaceOrders(options, 1);
  });

  await Promise.all(expectations);
}

export { expectToAcceptShorthandNumberArguments };

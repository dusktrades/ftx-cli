import BigNumber from 'bignumber.js';

function getPriceHookKey(priceHook) {
  switch (priceHook) {
    case 'last':
      return 'last';
    case 'bid':
      return 'bid';
    case 'ask':
      return 'ask';
    default:
      // Market price.
      return 'price';
  }
}

function calculateRelativePrice({ price, priceHook }, marketData) {
  const key = getPriceHookKey(priceHook);
  const priceHookPrice = new BigNumber(marketData[key]);

  return price.value(priceHookPrice);
}

export { calculateRelativePrice };

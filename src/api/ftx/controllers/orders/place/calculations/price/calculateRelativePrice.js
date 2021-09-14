import BigNumber from 'bignumber.js';

function getPriceHookKey(priceHookName) {
  switch (priceHookName) {
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

function calculateDynamicPrice({ price, priceHook }, marketData) {
  const key = getPriceHookKey(priceHook.value);
  const priceHookPrice = new BigNumber(marketData[key]);

  return price.value(priceHookPrice);
}

function calculateRelativePrice(data, marketData) {
  return data.priceHook.type === 'dynamic'
    ? calculateDynamicPrice(data, marketData)
    : data.price.value(data.priceHook.value);
}

export { calculateRelativePrice };

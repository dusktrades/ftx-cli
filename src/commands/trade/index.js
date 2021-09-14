import { Ftx } from '../../api/index.js';

async function run(options) {
  const credentials = {
    apiKey: options.global.key,
    apiSecret: options.global.secret,
    subaccount: options.global.subaccount,
  };

  const data = {
    market: options.command.market,
    side: options.command.side,
    type: options.command.type,
    size: options.command.size,
    sizeCurrency: options.global.sizeCurrency,
    sizeHook: options.global.sizeHook,
    price: options.command.price,
    priceHook: options.global.priceHook,
    triggerPrice: options.command.triggerPrice,
    trailValue: options.command.trailValue,
    splitCount: options.command.split,
    durationMilliseconds: options.command.duration,
    enableReduceOnly: options.global.reduceOnly,
    enableIoc: options.global.ioc,
    enablePostOnly: options.global.postOnly,
    enableRetry: options.global.retry,
    rateLimit: options.global.rateLimit,
  };

  await Ftx.orders.place({
    exchange: options.global.exchange,
    credentials,
    data,
  });
}

const trade = { run };

export { trade };

import { Ftx } from '../../../src/api/index.js';

async function run(options) {
  const credentials = {
    apiKey: options.key,
    apiSecret: options.secret,
    subaccount: options.subaccount,
  };

  await Ftx.orders.place({
    exchange: options.exchange,
    credentials,
    data: options,
  });
}

export { run };

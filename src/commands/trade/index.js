import { Ftx } from '../../api/index.js';
import { Logger } from '../../common/index.js';

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
    price: options.command.price,
    size: options.command.size,
    orderCount: options.command.count,
  };

  await Ftx.orders.place({
    exchange: options.global.exchange,
    credentials,
    data,
  });

  Logger.info('Placed order(s)', {
    enableColours: options.global.enableColours,
  });
}

const trade = { run };

export { trade };

import { Ftx } from '../../api/index.js';
import { Logger } from '../../common/index.js';

async function run(options) {
  const credentials = {
    apiKey: options.global.key,
    apiSecret: options.global.secret,
    subaccount: options.global.subaccount,
  };

  Logger.info('Cancelling order(s)', {
    enableColours: options.global.enableColours,
  });

  await Ftx.orders.cancel({
    exchange: options.global.exchange,
    credentials,
    filters: {
      market: options.command.market,
      side: options.command.side,
    },
  });

  Logger.info('Queued order cancellation(s)', {
    enableColours: options.global.enableColours,
  });
}

const cancel = { run };

export { cancel };

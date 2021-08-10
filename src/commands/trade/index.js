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
    triggerPrice: options.command.triggerPrice,
    trailValue: options.command.trailValue,
    splitCount: options.command.split,
    durationMilliseconds: options.command.duration,
    enableIoc: options.global.enableIoc,
    enablePostOnly: options.global.enablePostOnly,
    enableReduceOnly: options.global.enableReduceOnly,
    enableRetry: options.global.enableRetry,
    rateLimit: options.global.rateLimit,
  };

  Logger.info('Processing order(s)', {
    enableColours: options.global.enableColours,
  });

  try {
    await Ftx.orders.place({
      exchange: options.global.exchange,
      credentials,
      data,
      enableColours: options.global.enableColours,
    });

    Logger.info('Order placement completed', {
      enableColours: options.global.enableColours,
    });
  } catch {
    /**
     * Errors are handled at per-order level because complex orders may be
     * partially accepted and/or have several different errors to report.
     */
    Logger.error('One or more orders failed to be placed', {
      enableColours: options.global.enableColours,
    });
  }
}

const trade = { run };

export { trade };

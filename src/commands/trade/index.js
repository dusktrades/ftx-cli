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
    size: options.command.size,
    sizeCurrency: options.global.sizeCurrency,
    price: options.command.price,
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

  Logger.info('Processing order(s)');

  try {
    await Ftx.orders.place({
      exchange: options.global.exchange,
      credentials,
      data,
    });

    Logger.info('Placed order(s)');
  } catch {
    process.exitCode = 1;

    /**
     * Errors are also handled at per-order level because complex orders may be
     * partially accepted and/or have several different errors to report.
     */
    Logger.error('One or more orders failed to be placed');
  }
}

const trade = { run };

export { trade };

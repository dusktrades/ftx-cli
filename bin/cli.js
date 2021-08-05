#!/usr/bin/env node

import { Option, program } from 'commander';

import { CONFIG } from '../src/config/index.js';
import { OPTIONS } from './options/index.js';
import { runCommand } from './runCommand.js';

function composeSortOption(choices) {
  return new Option('--sort <sorting method>', 'sorting method').choices(
    choices
  );
}

program.version(CONFIG.PACKAGE.version, '-v, --version');

program.addHelpText(
  'after',
  '\nGitHub: https://github.com/dusktrades/ftx-cli#readme'
);

program
  .addOption(OPTIONS.GLOBAL.EXCHANGE)
  .option(...OPTIONS.GLOBAL.API_KEY)
  .option(...OPTIONS.GLOBAL.API_SECRET)
  .option(...OPTIONS.GLOBAL.SUBACCOUNT)
  .option(...OPTIONS.GLOBAL.REPEAT)
  .option(...OPTIONS.GLOBAL.ENABLE_COLOURS)
  .option(...OPTIONS.GLOBAL.DISABLE_COLOURS)
  .option(...OPTIONS.GLOBAL.ENABLE_POST_ONLY)
  .option(...OPTIONS.GLOBAL.DISABLE_POST_ONLY)
  .option(...OPTIONS.GLOBAL.ENABLE_IOC)
  .option(...OPTIONS.GLOBAL.DISABLE_IOC)
  .option(...OPTIONS.GLOBAL.ENABLE_REDUCE_ONLY)
  .option(...OPTIONS.GLOBAL.DISABLE_REDUCE_ONLY)
  .option(...OPTIONS.GLOBAL.ENABLE_RETRY)
  .option(...OPTIONS.GLOBAL.DISABLE_RETRY);

program
  .command('login')
  .description('store FTX API credentials locally')
  .action((inlineCommandOptions) => runCommand('login', inlineCommandOptions));

program
  .command('logout')
  .description('remove stored FTX API credentials')
  .action((inlineCommandOptions) => runCommand('logout', inlineCommandOptions));

program
  .command('config')
  .description('store option preferences locally')
  .action((inlineCommandOptions) => runCommand('config', inlineCommandOptions));

program
  .command('rates')
  .description('display lending rates')
  .option(...OPTIONS.COMMANDS.CURRENCY)
  .addOption(composeSortOption(['currency', 'previous', 'estimated']))
  .action((inlineCommandOptions) => runCommand('rates', inlineCommandOptions));

program
  .command('earnings')
  .description('display my lending earnings')
  .action((inlineCommandOptions) =>
    runCommand('earnings', inlineCommandOptions)
  );

program
  .command('offers')
  .description('display my open lending offers')
  .addOption(
    composeSortOption(['currency', 'lendable', 'offered', 'locked', 'min-rate'])
  )
  .action((inlineCommandOptions) => runCommand('offers', inlineCommandOptions));

program
  .command('lend')
  .description('create lending offer(s)')
  .option(...OPTIONS.COMMANDS.CURRENCY)
  .option(...OPTIONS.COMMANDS.SIZE)
  .option(...OPTIONS.COMMANDS.MIN_RATE)
  .action((inlineCommandOptions) => runCommand('lend', inlineCommandOptions));

program
  .command('stop')
  .description('withdraw lending offer(s)')
  .option(...OPTIONS.COMMANDS.CURRENCY)
  .action((inlineCommandOptions) => runCommand('stop', inlineCommandOptions));

program
  .command('spot')
  .description('display spot markets')
  .option(...OPTIONS.COMMANDS.CURRENCY)
  .option(...OPTIONS.COMMANDS.SPOT_TYPE)
  .option(...OPTIONS.COMMANDS.QUOTE_CURRENCY)
  .option(...OPTIONS.COMMANDS.TOKEN_LEVERAGE)
  .addOption(
    composeSortOption(['name', 'price', 'change-1h', 'change-24h', 'volume'])
  )
  .action((inlineCommandOptions) => runCommand('spot', inlineCommandOptions));

program
  .command('futures')
  .description('display futures stats')
  .option(...OPTIONS.COMMANDS.CURRENCY)
  .option(...OPTIONS.COMMANDS.FUTURE_TYPE)
  .addOption(
    composeSortOption([
      'name',
      'last-price',
      'mark-price',
      'change-1h',
      'change-24h',
      'volume',
      'open-interest',
      'oi',
      'previous-funding',
      'estimated-funding',
    ])
  )
  .action((inlineCommandOptions) =>
    runCommand('futures', inlineCommandOptions)
  );

program
  .command('trade')
  .description('place order')
  .requiredOption(...OPTIONS.COMMANDS.MARKET)
  .requiredOption(...OPTIONS.COMMANDS.SIDE)
  .requiredOption(...OPTIONS.COMMANDS.ORDER_TYPE)
  .requiredOption(...OPTIONS.COMMANDS.SIZE)
  .option(...OPTIONS.COMMANDS.PRICE)
  .option(...OPTIONS.COMMANDS.TRIGGER_PRICE)
  .option(...OPTIONS.COMMANDS.TRAIL_VALUE)
  .option(...OPTIONS.COMMANDS.ORDER_COUNT)
  .action((inlineCommandOptions) => runCommand('trade', inlineCommandOptions));

program.parseAsync(process.argv);

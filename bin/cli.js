#!/usr/bin/env node

import BigNumber from 'bignumber.js';
import { Option, program } from 'commander';

import { CONFIG } from '../src/config/index.js';
import { parseOption } from './parseOption.js';
import { runCommand } from './runCommand.js';

function composeSortOption(choices) {
  return new Option('--sort <sorting method>', 'sorting method').choices(
    choices
  );
}

const GLOBAL_OPTIONS = {
  EXCHANGE: new Option(
    '-e, --exchange <exchange>',
    'FTX exchange platform'
  ).choices(['ftx', 'ftx-us']),
  API_KEY: ['-k, --key <key>', 'FTX API key'],
  API_SECRET: ['-x, --secret <secret>', 'FTX API secret'],
  SUBACCOUNT: ['-a, --subaccount <subaccount>', 'FTX subaccount name'],
  REPEAT: [
    '-z, --repeat [cron expression]',
    'repeat the command with optional schedule',
    parseOption.repeat,
  ],
  ENABLE_COLOURS: ['--colour', 'enable coloured output'],
  DISABLE_COLOURS: ['--no-colour', 'disable coloured output'],
};

const TYPE_FLAGS = '-t, --type <type>';

const COMMAND_OPTIONS = {
  CURRENCY: [
    '-c, --currency <currency>',
    'currency symbol(s)',
    parseOption.currency,
  ],
  SIZE: ['-s, --size <size>', 'currency amount', parseOption.size],
  MIN_RATE: [
    '-r, --min-rate <rate>',
    'minimum yearly lending rate (%)',
    parseOption.minRate,
  ],

  // TODO: Convert to regular spread option instead of custom constructor.
  SPOT_TYPE: new Option(TYPE_FLAGS, 'spot type').argParser(
    parseOption.spotType
  ),
  QUOTE_CURRENCY: [
    '-q, --quote-currency <currency>',
    'quote currency symbol(s)',
    parseOption.currency,
  ],
  TOKEN_LEVERAGE: [
    '--token-leverage <leverage>',
    'token leverage name or multiplier',
    parseOption.tokenLeverage,
  ],

  FUTURE_TYPE: new Option(TYPE_FLAGS, 'future type').argParser(
    parseOption.futureType
  ),

  MARKET: ['-m, --market <market>', 'market symbol', parseOption.market],
  SIDE: ['--side <side>', 'order side', parseOption.side],
  ORDER_TYPE: [TYPE_FLAGS, 'order type', parseOption.orderType],
  PRICE: ['-p, --price <price>', 'limit price', parseOption.price],
  ORDER_COUNT: [
    '--count <count>',
    'order count',
    parseOption.orderCount,
    new BigNumber(1),
  ],
};

program.version(CONFIG.PACKAGE.version, '-v, --version');

program.addHelpText(
  'after',

  // TODO: Change to newline instead of template string.
  `
GitHub: https://github.com/dusktrades/ftx-cli`
);

program
  .addOption(GLOBAL_OPTIONS.EXCHANGE)
  .option(...GLOBAL_OPTIONS.API_KEY)
  .option(...GLOBAL_OPTIONS.API_SECRET)
  .option(...GLOBAL_OPTIONS.SUBACCOUNT)
  .option(...GLOBAL_OPTIONS.REPEAT)
  .option(...GLOBAL_OPTIONS.ENABLE_COLOURS)
  .option(...GLOBAL_OPTIONS.DISABLE_COLOURS);

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
  .option(...COMMAND_OPTIONS.CURRENCY)
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
  .option(...COMMAND_OPTIONS.CURRENCY)
  .option(...COMMAND_OPTIONS.SIZE)
  .option(...COMMAND_OPTIONS.MIN_RATE)
  .action((inlineCommandOptions) => runCommand('lend', inlineCommandOptions));

program
  .command('stop')
  .description('withdraw lending offer(s)')
  .option(...COMMAND_OPTIONS.CURRENCY)
  .action((inlineCommandOptions) => runCommand('stop', inlineCommandOptions));

program
  .command('spot')
  .description('display spot markets')
  .option(...COMMAND_OPTIONS.CURRENCY)
  .addOption(COMMAND_OPTIONS.SPOT_TYPE)
  .option(...COMMAND_OPTIONS.QUOTE_CURRENCY)
  .option(...COMMAND_OPTIONS.TOKEN_LEVERAGE)
  .addOption(
    composeSortOption(['name', 'price', 'change-1h', 'change-24h', 'volume'])
  )
  .action((inlineCommandOptions) => runCommand('spot', inlineCommandOptions));

program
  .command('futures')
  .description('display futures stats')
  .option(...COMMAND_OPTIONS.CURRENCY)
  .addOption(COMMAND_OPTIONS.FUTURE_TYPE)
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
  .requiredOption(...COMMAND_OPTIONS.MARKET)
  .requiredOption(...COMMAND_OPTIONS.SIDE)
  .requiredOption(...COMMAND_OPTIONS.ORDER_TYPE)
  .option(...COMMAND_OPTIONS.PRICE)
  .requiredOption(...COMMAND_OPTIONS.SIZE)
  .option(...COMMAND_OPTIONS.ORDER_COUNT)
  .action((inlineCommandOptions) => runCommand('trade', inlineCommandOptions));

program.parseAsync(process.argv);

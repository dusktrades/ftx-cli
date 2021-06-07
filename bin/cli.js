#!/usr/bin/env node

import { program, Option } from 'commander';

import { CONFIG } from '../src/config/index.js';
import { runCommand } from './runCommand.js';

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
  ],
  ENABLE_COLOURS: ['--colour', 'enable coloured output'],
  DISABLE_COLOURS: ['--no-colour', 'disable coloured output'],
};

const COMMAND_OPTIONS = {
  CURRENCY: ['-c, --currency <currency>', 'currency symbol'],
};

program.version(CONFIG.PACKAGE.version, '-v, --version');

program.addHelpText(
  'after',
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
  .description(
    'display lending rates for a currency, or all if no currency is provided'
  )
  .option(...COMMAND_OPTIONS.CURRENCY)
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
  .action((inlineCommandOptions) => runCommand('offers', inlineCommandOptions));

program
  .command('lend')
  .description(
    'create a lending offer for a currency, or all if no currency is provided'
  )
  .option(...COMMAND_OPTIONS.CURRENCY)
  .option('-s, --size <size>', 'currency amount')
  .option('-r, --min-rate <rate>', 'minimum yearly lending rate (%)')
  .action((inlineCommandOptions) => runCommand('lend', inlineCommandOptions));

program
  .command('stop')
  .description(
    'withdraw my lending offer for a currency, or all if no currency is provided'
  )
  .option(...COMMAND_OPTIONS.CURRENCY)
  .action((inlineCommandOptions) => runCommand('stop', inlineCommandOptions));

program.parseAsync(process.argv);

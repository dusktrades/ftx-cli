import { Option } from 'commander';

import { REPEAT } from './repeat/index.js';

const GLOBAL = {
  EXCHANGE: new Option(
    '-e, --exchange <exchange>',
    'FTX exchange platform'
  ).choices(['ftx', 'ftx-us']),
  API_KEY: ['-k, --key <key>', 'FTX API key'],
  API_SECRET: ['-x, --secret <secret>', 'FTX API secret'],
  SUBACCOUNT: ['-a, --subaccount <subaccount>', 'FTX subaccount name'],
  REPEAT,
  ENABLE_COLOURS: ['--colour', 'enable coloured output'],
  DISABLE_COLOURS: ['--no-colour', 'disable coloured output'],
  ENABLE_POST_ONLY: ['--post-only', 'enable Post-Only mode'],
  DISABLE_POST_ONLY: ['--no-post-only', 'disable Post-Only mode'],
  ENABLE_IOC: ['--ioc', 'enable Immediate-or-Cancel (IOC) mode'],
  DISABLE_IOC: ['--no-ioc', 'disable Immediate-or-Cancel (IOC) mode'],
  ENABLE_REDUCE_ONLY: ['--reduce-only', 'enable Reduce-Only mode'],
  DISABLE_REDUCE_ONLY: ['--no-reduce-only', 'disable Reduce-Only mode'],
  ENABLE_RETRY: ['--retry', 'enable Retry-Until-Filled mode'],
  DISABLE_RETRY: ['--no-retry', 'disable Retry-Until-Filled mode'],
};

export { GLOBAL };

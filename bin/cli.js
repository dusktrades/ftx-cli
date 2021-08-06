#!/usr/bin/env node

import { program } from 'commander';

import { CONFIG } from '../src/config/index.js';
import { COMMANDS } from './commands/index.js';
import { OPTIONS } from './options/index.js';

program.version(CONFIG.PACKAGE.version, '-v, --version');

program.addHelpText(
  'after',
  '\nGitHub: https://github.com/dusktrades/ftx-cli#readme'
);

for (const option of OPTIONS.GLOBAL) {
  program.addOption(option);
}

for (const command of COMMANDS) {
  program.addCommand(command);
}

program.parseAsync(process.argv);

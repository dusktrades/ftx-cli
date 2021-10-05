#!/usr/bin/env node

import { program } from 'commander';

import { CONFIG } from '../src/config/index.js';
import { enableTestMode } from './enableTestMode.js';
import { COMMANDS, composeCommand } from './commands/index.js';
import { OPTIONS, composeOption } from './options/index.js';

function addGlobalOptions() {
  for (const config of OPTIONS.GLOBAL) {
    const option = composeOption(config);

    program.addOption(option);
  }
}

function addCommands() {
  for (const config of COMMANDS) {
    const command = composeCommand(config);

    program.addCommand(command);
  }
}

function start() {
  program.usage('[command] [options]');

  program.version(
    CONFIG.PACKAGE.version,
    '-v, --version',
    'Output the version number.'
  );

  program.addHelpCommand('help [command]', 'Display help for command.');
  program.helpOption('-h, --help', 'Display help for command.');

  program.addHelpText(
    'after',
    '\nGitHub: https://github.com/dusktrades/ftx-cli#readme'
  );

  addGlobalOptions();
  addCommands();

  if (process.env.NODE_ENV === 'test-child') {
    enableTestMode();
  }

  program.parseAsync(process.argv);
}

start();

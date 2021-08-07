#!/usr/bin/env node

import { program } from 'commander';

import { CONFIG } from '../src/config/index.js';
import { COMMANDS, composeCommand } from './commands/index.js';
import { OPTIONS, composeOption } from './options/index.js';

function addGlobalOptions() {
  for (const optionConfig of OPTIONS.GLOBAL) {
    const option = composeOption(optionConfig);

    program.addOption(option);
  }
}

function addCommands() {
  for (const commandConfig of COMMANDS) {
    const command = composeCommand(commandConfig);

    program.addCommand(command);
  }
}

function initialise() {
  program.version(CONFIG.PACKAGE.version, '-v, --version');

  program.addHelpText(
    'after',
    '\nGitHub: https://github.com/dusktrades/ftx-cli#readme'
  );

  addGlobalOptions();
  addCommands();
  program.parseAsync(process.argv);
}

initialise();

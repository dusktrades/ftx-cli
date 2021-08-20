import { Command } from 'commander';

import { composeOption } from '../options/index.js';
import { runCommand } from '../runCommand.js';

function addOptions(command, optionConfigs) {
  if (optionConfigs == null) {
    return;
  }

  for (const { OPTION, IS_REQUIRED } of optionConfigs) {
    const option = composeOption(OPTION, IS_REQUIRED);

    command.addOption(option);
  }
}

function composeCommand(config) {
  // Name, description, and action are required.
  const command = new Command(config.NAME)
    .description(config.DESCRIPTION)
    .action(async (inlineCommandOptions) => {
      await runCommand(config.NAME, inlineCommandOptions);
    });

  addOptions(command, config.OPTIONS);

  return command;
}

export { composeCommand };

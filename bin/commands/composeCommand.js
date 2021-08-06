import { Command } from 'commander';

import { runCommand } from '../runCommand.js';

function addOptions(command, optionConfigs) {
  if (optionConfigs == null) {
    return;
  }

  for (const optionConfig of optionConfigs) {
    const option = optionConfig.IS_REQUIRED
      ? optionConfig.OPTION.makeOptionMandatory()
      : optionConfig.OPTION;

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

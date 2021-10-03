import { Command } from 'commander';

import { composeOption } from '../options/index.js';
import { runCommand } from '../runCommand.js';

function addOptions(command, options) {
  if (options == null) {
    return;
  }

  for (const { option: config } of options) {
    const option = composeOption(config);

    command.addOption(option);
  }
}

function composeCommand(config) {
  // Name, description, and action are required.
  const command = new Command(config.name)
    .description(config.description)
    .helpOption('-h, --help', 'Display help for command.')
    .action(async (inlineCommandOptions) => {
      await runCommand(config, inlineCommandOptions);
    });

  addOptions(command, config.options);

  return command;
}

export { composeCommand };

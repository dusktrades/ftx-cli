import { program } from 'commander';

import { setServerTimeOffset } from '../src/api/ftx/endpoints/request.js';
import { Logger, OptionError, Prompter } from '../src/common/index.js';
import { CONFIG } from '../src/config/index.js';
import { handleError } from './handleError.js';
import { OPTIONS } from './options/index.js';
import { queueUpdateNotification } from './queueUpdateNotification.js';
import { scheduleCommand } from './scheduleCommand.js';

/**
 * Option argument priority order:
 *
 * 1. Inline
 * 2. Saved config
 */
function prioritiseOptionValue(option, inlineGlobalOptions) {
  return inlineGlobalOptions[option] ?? CONFIG.USER.get(option);
}

function composeConfigurableGlobalOptions(inlineGlobalOptions) {
  const configurable = OPTIONS.GLOBAL.filter(
    ({ isConfigurable }) => isConfigurable
  );

  const entries = configurable.map(({ name }) => [
    name,
    prioritiseOptionValue(name, inlineGlobalOptions),
  ]);

  return Object.fromEntries(entries);
}

function composeSchedule(schedule, compound) {
  return compound
    ? // Run at 59 minutes past every hour (UTC/exchange time).
      { type: 'cron', cronExpression: '59 * * * *', timezone: 'UTC' }
    : schedule;
}

function composeGlobalOptions(compound) {
  const inlineGlobalOptions = program.opts();

  return {
    ...composeConfigurableGlobalOptions(inlineGlobalOptions),
    schedule: composeSchedule(inlineGlobalOptions.schedule, compound),
  };
}

/**
 * We should prompt for interactive input if the following criteria are met:
 *
 * - The user has selected interactive mode
 * - The command has defined interactive prompts
 */
function shouldPromptQuestions(isInteractive, composePrompts) {
  return isInteractive && composePrompts != null;
}

async function promptQuestions(globalOptions, composePrompts) {
  const { questions, handleSubmit } = await composePrompts(globalOptions);
  const answers = await Prompter.prompt(questions);

  return handleSubmit(answers);
}

async function composeCommandOptions(
  commandOptions,
  inlineCommandOptions,
  globalOptions,
  composePrompts
) {
  const defaultCommandOptions = Object.fromEntries(
    commandOptions
      .filter(({ option }) => option.default != null)
      .map(({ option }) => [option.name, option.default])
  );

  const userCommandOptions = shouldPromptQuestions(
    globalOptions.interactive,
    composePrompts
  )
    ? await promptQuestions(globalOptions, composePrompts)
    : inlineCommandOptions;

  return {
    ...defaultCommandOptions,
    ...userCommandOptions,
  };
}

function validateCommandOptions(parsedOptions, commandOptions) {
  const requiredOptions = commandOptions.filter(({ isRequired }) => isRequired);

  for (const { option } of requiredOptions) {
    if (parsedOptions[option.name] == null) {
      throw new OptionError(`Missing required option: ${option.flags}`);
    }
  }
}

async function composeOptions(
  inlineCommandOptions,
  { options, composePrompts }
) {
  const global = composeGlobalOptions(inlineCommandOptions.compound);

  const command = await composeCommandOptions(
    options,
    inlineCommandOptions,
    global,
    composePrompts
  );

  validateCommandOptions(command, options);

  return { ...global, ...command };
}

function shouldNotifyUpdate({ updateNotifications, output }) {
  return updateNotifications && output === 'table';
}

async function runHandler(run, options) {
  await (options.schedule == null
    ? run(options)
    : scheduleCommand(run, options));
}

async function runCommand(commandConfig, inlineCommandOptions) {
  try {
    const options = await composeOptions(inlineCommandOptions, commandConfig);

    Logger.setEnableColours(options.colour);

    if (shouldNotifyUpdate(options)) {
      queueUpdateNotification(options.colour);
    }

    await setServerTimeOffset(options);
    await runHandler(commandConfig.run, options);
  } catch (error) {
    handleError(error);
  }
}

export { runCommand };

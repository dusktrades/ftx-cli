import chalk from 'chalk';
import updateNotifier from 'update-notifier';

import { CONFIG } from '../src/config/index.js';

const currentVersionTemplate = 'v{currentVersion}';
const latestVersionTemplate = 'v{latestVersion}';
const rawCommand = 'npm install -g ftx-cli';

const releaseNotesUrlTemplate =
  'https://github.com/dusktrades/ftx-cli/releases/tag/v{latestVersion}';

function composeColouredConfig() {
  return {
    currentVersion: chalk.grey(currentVersionTemplate),
    latestVersion: chalk.green(latestVersionTemplate),
    command: chalk.cyan(rawCommand),
    releaseNotesUrl: chalk.grey(releaseNotesUrlTemplate),
  };
}

function composeUncolouredConfig() {
  return {
    currentVersion: currentVersionTemplate,
    latestVersion: latestVersionTemplate,
    command: `\`${rawCommand}\``,
    releaseNotesUrl: releaseNotesUrlTemplate,
  };
}

function composeMessage(enableColours) {
  const { currentVersion, latestVersion, command, releaseNotesUrl } =
    enableColours ? composeColouredConfig() : composeUncolouredConfig();

  return `FTX CLI update available: ${currentVersion} → ${latestVersion}\n\nRun ${command} to update via npm!\n\nRelease notes: ${releaseNotesUrl}`;
}

function queueUpdateNotification(enableColours) {
  const notifier = updateNotifier({ pkg: CONFIG.PACKAGE });

  notifier.notify({
    message: composeMessage(enableColours),
    boxenOptions: {
      padding: { left: 1, right: 1 },
      margin: 0,
      align: 'center',
      borderColor: enableColours ? 'cyan' : null,
      borderStyle: 'single',
    },
  });
}

export { queueUpdateNotification };

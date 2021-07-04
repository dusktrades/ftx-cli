import chalk from 'chalk';
import updateNotifier from 'update-notifier';

import { CONFIG } from '../src/config/index.js';

const CURRENT_VERSION = 'v{currentVersion}';
const LATEST_VERSION = 'v{latestVersion}';
const COMMAND = 'npm install -g ftx-cli';
const RELEASE_NOTES_URL =
  'https://github.com/dusktrades/ftx-cli/releases/tag/v{latestVersion}';

// TODO: Remove dev parameters.
const Notifier = updateNotifier({
  pkg: {
    ...CONFIG.PACKAGE,
    version: '1.0.0',
  },
  updateCheckInterval: 0,
});

function composeCurrentVersion(enableColours) {
  return enableColours ? chalk.grey(CURRENT_VERSION) : CURRENT_VERSION;
}

function composeLatestVersion(enableColours) {
  return enableColours ? chalk.green(LATEST_VERSION) : LATEST_VERSION;
}

function composeCommand(enableColours) {
  return enableColours ? chalk.cyan(COMMAND) : `\`${COMMAND}\``;
}

function composeReleaseNotesUrl(enableColours) {
  return enableColours ? chalk.grey(RELEASE_NOTES_URL) : RELEASE_NOTES_URL;
}

function composeMessage(enableColours) {
  const currentVersion = composeCurrentVersion(enableColours);
  const latestVersion = composeLatestVersion(enableColours);
  const command = composeCommand(enableColours);
  const releaseNotesUrl = composeReleaseNotesUrl(enableColours);

  return `FTX CLI update available: ${currentVersion} → ${latestVersion}\n\nRun ${command} to update via npm!\n\nRelease notes: ${releaseNotesUrl}`;
}

function notifyUpdate(enableColours) {
  Notifier.notify({
    message: composeMessage(enableColours),
    boxenOptions: {
      padding: 1,
      margin: 1,
      align: 'center',
      borderColor: enableColours ? 'grey' : null,
      borderStyle: 'single',
    },
  });
}

export { notifyUpdate };

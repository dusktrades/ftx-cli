import chalk from 'chalk';
import updateNotifier from 'update-notifier';

import { CONFIG } from '../src/config/index.js';

const CURRENT_VERSION_TEMPLATE = 'v{currentVersion}';
const LATEST_VERSION_TEMPLATE = 'v{latestVersion}';
const COMMAND = 'npm install -g ftx-cli';

const RELEASE_NOTES_URL_TEMPLATE =
  'https://github.com/dusktrades/ftx-cli/releases/tag/v{latestVersion}';

function composeCurrentVersion(enableColours) {
  return enableColours
    ? chalk.grey(CURRENT_VERSION_TEMPLATE)
    : CURRENT_VERSION_TEMPLATE;
}

function composeLatestVersion(enableColours) {
  return enableColours
    ? chalk.green(LATEST_VERSION_TEMPLATE)
    : LATEST_VERSION_TEMPLATE;
}

function composeCommand(enableColours) {
  return enableColours ? chalk.cyan(COMMAND) : `\`${COMMAND}\``;
}

function composeReleaseNotesUrl(enableColours) {
  return enableColours
    ? chalk.grey(RELEASE_NOTES_URL_TEMPLATE)
    : RELEASE_NOTES_URL_TEMPLATE;
}

function composeMessage(enableColours) {
  const currentVersion = composeCurrentVersion(enableColours);
  const latestVersion = composeLatestVersion(enableColours);
  const command = composeCommand(enableColours);
  const releaseNotesUrl = composeReleaseNotesUrl(enableColours);

  return `FTX CLI update available: ${currentVersion} → ${latestVersion}\n\nRun ${command} to update via npm!\n\nRelease notes: ${releaseNotesUrl}`;
}

function getBorderColour(enableColours) {
  return enableColours ? 'cyan' : null;
}

function notifyUpdate(enableColours) {
  const notifier = updateNotifier({ pkg: CONFIG.PACKAGE });

  notifier.notify({
    message: composeMessage(enableColours),
    boxenOptions: {
      padding: { left: 1, right: 1 },
      margin: 0,
      align: 'center',
      borderColor: getBorderColour(enableColours),
      borderStyle: 'single',
    },
  });
}

export { notifyUpdate };

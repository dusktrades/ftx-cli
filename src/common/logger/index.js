/* eslint-disable no-console */

import chalk from 'chalk';
import stripAnsi from 'strip-ansi';

let enableColours = true;

/**
 * Log levels should be coloured if the following criteria are met:
 *
 * - Colours are enabled
 * - The given log level has been assigned a colour
 */
function shouldColour(colour) {
  return enableColours && colour != null;
}

function formatLevel({ name, colour }) {
  const formattedLevel = name.toUpperCase().padEnd(5);

  if (!shouldColour(colour)) {
    return formattedLevel;
  }

  return shouldColour(colour) ? chalk[colour](formattedLevel) : formattedLevel;
}

function composeMessageString(level, message) {
  const formattedTimestamp = new Date().toISOString();
  const formattedLevel = formatLevel(level);
  const messageString = `${formattedTimestamp}  ${formattedLevel}  ${message}`;

  return enableColours ? messageString : stripAnsi(messageString);
}

function log(level, message) {
  const messageString = composeMessageString(level, message);

  console[level.name](messageString);
}

function info(message) {
  log({ name: 'info' }, message);
}

function warn(message) {
  /**
   * Despite outputting to `stderr`, we shouldn't set exit code to 1 because
   * warnings are less critical than errors.
   */
  log({ name: 'warn', colour: 'yellow' }, message);
}

function error(message) {
  // Let the process know that an error has occurred somewhere.
  process.exitCode = 1;
  log({ name: 'error', colour: 'red' }, message);
}

function table(data) {
  const tableString = data.toString();

  console.info(enableColours ? tableString : stripAnsi(tableString));
}

function json(data) {
  console.info(JSON.stringify(data));
}

function setEnableColours(newEnableColours) {
  enableColours = newEnableColours;
}

const Logger = {
  info,
  warn,
  error,
  table,
  json,
  setEnableColours,
};

export { Logger };

import chalk from 'chalk';
import stripAnsi from 'strip-ansi';

let enableColours = true;

function getConsoleMethod({ text }) {
  switch (text) {
    case 'error':
      return 'error';
    case 'warn':
      return 'warn';
    default:
      return 'log';
  }
}

function formatLevel({ text, colour }) {
  const formattedLevel = text.toUpperCase().padEnd(5);

  if (!enableColours) {
    return formattedLevel;
  }

  // Level hasn't been assigned a colour.
  if (colour == null) {
    return formattedLevel;
  }

  return chalk[colour](formattedLevel);
}

function composeMessageString(level, message) {
  const formattedTimestamp = new Date().toISOString();
  const formattedLevel = formatLevel(level);
  const messageString = `${formattedTimestamp}  ${formattedLevel}  ${message}`;

  return enableColours ? messageString : stripAnsi(messageString);
}

function log(level, message) {
  const consoleMethod = getConsoleMethod(level);
  const messageString = composeMessageString(level, message);

  console[consoleMethod](messageString);
}

function table(tableData) {
  const tableString = tableData.toString();

  console.log(enableColours ? tableString : stripAnsi(tableString));
}

function setEnableColours(newEnableColours) {
  enableColours = newEnableColours;
}

const Logger = {
  info(message) {
    log({ text: 'info' }, message);
  },
  warn(message) {
    log({ text: 'warn', colour: 'yellow' }, message);
  },
  error(message) {
    log({ text: 'error', colour: 'red' }, message);
  },
  table,
  setEnableColours,
};

export { Logger };

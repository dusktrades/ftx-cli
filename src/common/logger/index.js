import chalk from 'chalk';

/**
 * TODO: Could we just create a 'before any output' hook and strip ANSI codes?
 * This would mean we can treat the entire codebase in terms of colours being
 * enabled, and only worry about the disabled option at the last second.
 */
let enableColours = true;

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

function log(level, message) {
  const formattedTimestamp = new Date().toISOString();
  const formattedLevel = formatLevel(level);
  const consoleMethod = getConsoleMethod(level);

  console[consoleMethod](
    `${formattedTimestamp}  ${formattedLevel}  ${message}`
  );
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
  setEnableColours,
};

export { Logger };

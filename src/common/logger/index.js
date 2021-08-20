import chalk from 'chalk';

function formatLevel({ text, colour }, enableColours) {
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
      return console.error;
    case 'warn':
      return console.warn;
    default:
      return console.log;
  }
}

function log(level, message, enableColours) {
  const formattedTimestamp = new Date().toISOString();
  const formattedLevel = formatLevel(level, enableColours);
  const consoleMethod = getConsoleMethod(level);

  consoleMethod(`${formattedTimestamp}  ${formattedLevel}  ${message}`);
}

const Logger = {
  info(message, { enableColours }) {
    log({ text: 'info' }, message, enableColours);
  },
  warn(message, { enableColours }) {
    log({ text: 'warn', colour: 'yellow' }, message, enableColours);
  },
  error(message, { enableColours }) {
    log({ text: 'error', colour: 'red' }, message, enableColours);
  },
};

export { Logger };
